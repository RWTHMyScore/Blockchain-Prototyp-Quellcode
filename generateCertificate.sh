#!/bin/bash
openssl req -x509 -newkey rsa:4096 -keyout certificates/server.key -out certificates/server.crt -sha256 -days 365 -nodes