#!/bin/bash

mongod --replSet "padRepl" --logpath "rs1.log" --dbpath rs1 --port 27017 &
mongod --replSet "padRepl" --logpath "rs2.log" --dbpath rs2 --port 27018 &
mongod --replSet "padRepl" --logpath "rs3.log" --dbpath rs3 --port 27019 &

