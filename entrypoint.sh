#!/bin/bash
set -e

# Start PostgreSQL service
service postgresql start

# Wait for Postgres to be ready
sleep 3

# Ensure the postgres user has a password (from your .env)
echo "Setting postgres password..."
psql --username=postgres --command="ALTER USER postgres WITH PASSWORD '${PGPASSWORD}';" || true

# Create app user and database if they don't exist
DB_EXIST=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$PGDATABASE'")
if [ "$DB_EXIST" != "1" ]; then
    echo "Creating database $PGDATABASE..."
    psql -U postgres -c "CREATE USER $PGUSER WITH PASSWORD '$PGPASSWORD';" || true
    psql -U postgres -c "CREATE DATABASE $PGDATABASE OWNER $PGUSER;"
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $PGDATABASE TO $PGUSER;"
fi

# Start Node.js app
echo "Starting Node.js server..."
exec node src/server.js
