(
    cd "$(dirname "$0")"
    cd ../../chaincode

    on_sigint() { kill ${PIDS[*]} && kill $$; }
    on_sigusr2() { kill ${PIDS[*]} && kill -SIGUSR2 $$; }

    go build .
    CORE_PEER_ADDRESS=0.0.0.0:7052 CORE_CHAINCODE_ID_NAME=examplecc:v0 ./chaincode &
    PIDS[0]=$!
    CORE_PEER_ADDRESS=0.0.0.0:8052 CORE_CHAINCODE_ID_NAME=examplecc:v0 ./chaincode &
    PIDS[1]=$!
    CORE_PEER_ADDRESS=0.0.0.0:17052 CORE_CHAINCODE_ID_NAME=examplecc:v0 ./chaincode &
    PIDS[2]=$!
    CORE_PEER_ADDRESS=0.0.0.0:18052 CORE_CHAINCODE_ID_NAME=examplecc:v0 ./chaincode &
    PIDS[3]=$!

    trap on_sigint SIGINT
    trap on_sigusr2 SIGUSR2

    wait
)
