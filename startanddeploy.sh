#!/bin/bash
set -m
ganache -i 1337 --chain.chainId 1337 -h 0.0.0.0 -p 8546 -b 5 -e 2 --wallet.mnemonic "$MNEMONIC" &
sleep 2
truffle migrate --network dev
./copyABIs.sh
fg %1
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
