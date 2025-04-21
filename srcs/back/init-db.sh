#!/bin/sh

if [ ! -f "./data/database.sqlite3" ]; then
  echo "Initializing SQLite DB..."
  mkdir -p ./data
  sqlite3 ./data/database.sqlite3 < ./init.sql
else
  echo "SQLite DB already exists."
fi
