#!/bin/bash
set -e

echo "Starting PostgreSQL..."
service postgresql start
echo "Environment check: PGUSER=$PGUSER, PGDATABASE=$PGDATABASE"

# Wait for PostgreSQL to be ready
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

# Now that trust mode allows us in, set proper password
echo "Setting postgres password..."
psql -U postgres -c "ALTER USER postgres WITH PASSWORD '${PGPASSWORD}';"

# Revert auth method back to scram-sha-256 for security
sed -ri "s/^#?(host\s+all\s+all\s+127\.0\.0\.1\/32\s+)trust/\1scram-sha-256/" /etc/postgresql/*/main/pg_hba.conf
sed -ri "s/^#?(host\s+all\s+all\s+::1\/128\s+)trust/\1scram-sha-256/" /etc/postgresql/*/main/pg_hba.conf

service postgresql restart

# Create database if not exists
DB_EXIST=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${PGDATABASE}'")
if [ "$DB_EXIST" != "1" ]; then
  echo "Creating database ${PGDATABASE}..."
  psql -U postgres -c "CREATE DATABASE ${PGDATABASE};"
else
  echo "Database ${PGDATABASE} already exists."
fi

echo "Starting Node.js server..."
exec node src/server.js
