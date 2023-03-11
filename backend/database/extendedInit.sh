#!/bin/bash

INIT_ACCOUNTS='[{"firstname":"Alice","lastname":"Administrator","email":"alice@example.com","password":"credit","department":"Department of Computer Science"}]' INIT_DEPARTMENTS='[{"name":"Department of Computer Science","pubkey":"0x67D2A308300320f8f35951D260925893930a46aF","privkey":"0xb92269e63d38d0ee1370abd0879c717cf3335d016da190bbbe6060c0b8224d37"}]' INIT_TEST_TRANSCRIPT_PATH="../../testfiles/RWTH CS NUS SoC Emily Chen.xml" node init.js -f
