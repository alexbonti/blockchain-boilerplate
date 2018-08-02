# A reusable Node based boilerplate for blockchain projects
This boilerplate serves as a base for <span>Node.js</span> based Hyperledger Fabric projects.
In this boilerplate the initialisation of the fabric network is performed via the <span>Node.js</span> client applications.

The boilerplate includes a development and deployment setup for launching a network of peers.
In development mode the chaincode, and client applications run locally on the host machine.
In deployment mode, the entire network is dockerised.

The default configuration is for a project with two peer organisations.

Note that this boilerplate is still a work in progress. Overtime additional features will be added to facilitate the creation of new projects.

## Prerequisites
* Node 8.4.0+: https://nodejs.org/en/
* Golang 1.8+: https://golang.org/
* Precommit: http://pre-commit.com/
* Dep: https://github.com/golang/dep
* Nodemon: `npm i -g nodemon`

This project must be cloned into `$GOPATH/src/<project-url>` eg: `$GOPATH/src/github.ibm.com/aur/node-blockchain-boilerplate`

## Project structure
* /chaincode – A folder containing the chaincode for the project
* /deploy – Deployment related scripts and configuration
* /portal/app – Frontend of client application
* /portal/server – Backend of client application
* /portal/server/conf – Fabric network configuration and certificates

## Usage

### Add Git pre-commit hooks
```
pre-commit install
```

### Dev mode
Runs a network where the chaincode, and client applications run locally on the host machine.
Note that both the chaincode, and client code are automatically reloaded on file change
```
make dev
```

in new terminal (launches org1 server in development mode).

**Troubleshooting**

If you encounter issues during the `go build` command: 

```
go build github.com/hyperledger/fabric/vendor/github.com/miekg/pkcs11: invalid flag in #cgo LDFLAGS: -I/usr/local/share/libtool
``` 
you can disable the check that fails the build:
```
CGO_LDFLAGS_ALLOW="-I.*" make dev
```
This is tested with Go 1.9.4 (and should also work with Go 1.10)

```
cd portal
npm i
CHAINCODE_DEV=true npm run serve:watch
```
in new terminal (launches org2 server in development mode)
```
cd portal
PORT=4000 ORG=org2 CHAINCODE_DEV=true npm run serve:watch
```

in new terminal (launches org1 frontend in development mode)
```
cd portal
npm start
```

### Production mode
Runs an entirely dockerised network
```
make
```

### Shutdown network and remove containers/images
```
make clean
```

### Shutdown network, remove containers/images, and remove generated Makefile targets
For when you want force clean installs
```
make hard-clean
```
