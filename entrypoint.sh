#!/bin/bash
set -e

# Start PostgreSQL service
service postgresql start

# Initialize database if it doesn't exist
DB_EXIST=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$PGDATABASE'")
if [ "$DB_EXIST" != "1" ]; then
    echo "Creating database..."
    sudo -u postgres psql -c "CREATE USER $PGUSER WITH PASSWORD '$PGPASSWORD';"
    sudo -u postgres psql -c "CREATE DATABASE $PGDATABASE OWNER $PGUSER;"
fi

# Start Node.js app
echo "Starting Node.js server..."
exec node src/server.js
