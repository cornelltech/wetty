#!/bin/bash

# install psql locally and run this file locally.  The postgres container should be up and listening on port 5432.


# creates table for sessions
#psql -h 127.0.0.1 -U postgres wetty < node_modules/connect-pg-simple/table.sql
#psql -h 127.0.0.1 -U postgres wetty -c "CREATE TABLE users ( username varchar(40) PRIMARY KEY, data json )"
psql -h 127.0.0.1 -U postgres wetty -c "CREATE TABLE chapters ( name varchar(40) PRIMARY KEY, data json )"
psql -h 127.0.0.1 -U postgres wetty -c "INSERT INTO chapters VALUES ('quest1', '{ \"hello\": \"some stuff\"}')"
psql -h 127.0.0.1 -U postgres wetty -c "INSERT INTO chapters VALUES ('client_server', '{ \"hello\": \"some stuff\"}')"
