NPM_SCOPE ?=blockchain
NPM_REGISTRY_LOGIN ?= https://na.artifactory.swg-devops.com/artifactory/api/npm/aur-npm-packages-local/auth/${NPM_SCOPE}
NPM_USERNAME ?= $(shell read -rp "Username for login to ${NPM_REGISTRY_LOGIN}: " REPLY; echo $$REPLY)
NPM_PASSWORD ?= $(shell read -rp "Password: " -s REPLY ; echo $$REPLY)
# From https://stackoverflow.com/questions/2483182/recursive-wildcards-in-gnu-make
rwildcard=$(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d))


.clone-fabric:
	if ! [ -d "$$GOPATH/src/github.com/hyperledger/fabric" ]; then \
		git clone https://github.com/hyperledger/fabric.git $$GOPATH/src/github.com/hyperledger/fabric; \
	fi
	cd $$GOPATH/src/github.com/hyperledger/fabric && \
		git checkout cd3669972df0215e82cc686732ec16ce0a69c397
	touch .clone-fabric


.pull-tag-images:
	docker pull hyperledger/fabric-peer:x86_64-1.1.0
	docker pull hyperledger/fabric-orderer:x86_64-1.1.0
	docker pull hyperledger/fabric-couchdb:x86_64-1.1.0-preview # no 1.1.0 ready yet
	docker pull hyperledger/fabric-ca:x86_64-1.1.0
	docker pull hyperledger/fabric-ccenv:x86_64-1.1.0
	docker image tag hyperledger/fabric-peer:x86_64-1.1.0 hyperledger/fabric-peer:latest
	docker image tag hyperledger/fabric-orderer:x86_64-1.1.0 hyperledger/fabric-orderer:latest
	docker image tag hyperledger/fabric-couchdb:x86_64-1.1.0-preview hyperledger/fabric-couchdb:latest
	docker image tag hyperledger/fabric-ca:x86_64-1.1.0 hyperledger/fabric-ca:latest
	docker image tag hyperledger/fabric-ccenv:x86_64-1.1.0 hyperledger/fabric-ccenv:latest
	touch .pull-tag-images


.build-image: portal/* $(call rwildcard, portal/app, *) $(call rwildcard, portal/server, *)
	docker build -t node-blockchain-boilerplate ./portal
	touch .build-image


.PHONY: deploy
deploy: .pull-tag-images .build-image
	cd deploy && \
		docker-compose -f docker-compose.yaml -f docker-compose.couchdb.yaml -f docker-compose.prod.yaml up -d


.PHONY: dev
dev: .clone-fabric .pull-tag-images
	cd deploy && \
		docker-compose -f docker-compose.yaml -f docker-compose.couchdb.yaml -f docker-compose.dev.yaml up -d

	while ! nc -z localhost 7051; do sleep 1; done
	while ! nc -z localhost 8051; do sleep 1; done
	while ! nc -z localhost 17051; do sleep 1; done
	while ! nc -z localhost 18051; do sleep 1; done

	sleep 5 # extra time needed for peer to initialise before launching chaincode

	nodemon --exec "bash ./deploy/scripts/run-chaincode.sh" --delay 1 --watch ./chaincode -e go


.PHONY: clean
clean:
	-cd deploy && \
		docker-compose -f docker-compose.yaml -f docker-compose.couchdb.yaml -f docker-compose.prod.yaml down
	-chaincodeContainers=`docker ps -a | grep peer\..org\..example.com | awk '{print $$1}'` ; \
		docker stop $$chaincodeContainers ; \
		docker rm $$chaincodeContainers
	-docker rmi `docker images | grep peer\..org\..example.com | awk '{print $3}'`
	rm -rf ./portal/server/keystores


.PHONY: hard-clean
hard-clean: clean
	-rm .build-image
	-rm .clone-fabric
	-rm .pull-tag-images
