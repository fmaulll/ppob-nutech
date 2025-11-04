#!/bin/bash
set -e

echo "Environment check: PGUSER=$PGUSER, PGDATABASE=$PGDATABASE"

# Locate PostgreSQL config and switch to trust mode before starting
PG_HBA=$(find /etc/postgresql -name pg_hba.conf)
if [ -f "$PG_HBA" ]; then
  echo "Temporarily switching PostgreSQL auth to trust..."
  sed -ri "s/^(host\s+all\s+all\s+127\.0\.0\.1\/32\s+).*/\1trust/" "$PG_HBA"
  sed -ri "s/^(host\s+all\s+all\s+::1\/128\s+).*/\1trust/" "$PG_HBA"
fi

echo "Starting PostgreSQL service..."
service postgresql start

# Wait for PostgreSQL to be ready
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

echo "Setting postgres password..."
# Connect to the default 'postgres' database
psql -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '${PGPASSWORD}';"

# Restore secure authentication
if [ -f "$PG_HBA" ]; then
  echo "Restoring PostgreSQL auth to scram-sha-256..."
  sed -ri "s/^(host\s+all\s+all\s+127\.0\.0\.1\/32\s+).*/\1scram-sha-256/" "$PG_HBA"
  sed -ri "s/^(host\s+all\s+all\s+::1\/128\s+).*/\1scram-sha-256/" "$PG_HBA"
  service postgresql restart
fi

# Create your app database if it doesn't exist
DB_EXIST=$(psql -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${PGDATABASE}'")
if [ "$DB_EXIST" != "1" ]; then
  echo "Creating database ${PGDATABASE}..."
  psql -U postgres -d postgres -c "CREATE DATABASE ${PGDATABASE};"
else
  echo "Database ${PGDATABASE} already exists."
fi

echo "Starting Node.js server..."
exec node src/server.js
