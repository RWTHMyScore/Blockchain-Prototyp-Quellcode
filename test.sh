#!/bin/bash
cd ../contracts
echo "Starting Ganache testchain..."
ganache -i 1337 --chain.chainId 1337 -h 0.0.0.0 -p 8546 -b 5 -e 10000 --wallet.mnemonic "shaft ill question arrive movie very plate cloud wing combine play occur" >/dev/null &
GANACHE_PID=$!
sleep 2
echo "Deploying contracts..."
PARTNER_A_UNIVERSITY="RWTH" PARTNER_A_DEPARTMENT="Department of Computer Science" PARTNER_A_SERVER=https://localhost:3000 PARTNER_B_PUBKEY=0x03CA1f52C11362E2088c79aBC290E31c4C09aAd1 PARTNER_B_UNIVERSITY="NUS" PARTNER_B_DEPARTMENT="School of Computing" PARTNER_B_SERVER=https://localhost:3001 truffle migrate --reset --network dev >/dev/null
./copyABIs.sh

sleep 2
cd ../backend
echo "Testing begins..."
NODE_ENV=development UNIVERSITY="RWTH" BLOCKCHAIN_NODE=ws://localhost:8546 DB_SOURCE=./database/mobility.db jest -i

kill $GANACHE_PID
