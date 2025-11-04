#!/bin/bash
set -e

# Start PostgreSQL service
service postgresql start

# Create database if it doesn't exist
DB_EXIST=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$PGDATABASE'")
if [ "$DB_EXIST" != "1" ]; then
    echo "Creating database $PGDATABASE..."
    psql -U postgres -c "CREATE DATABASE $PGDATABASE;"
    psql -U postgres -c "CREATE USER $PGUSER WITH PASSWORD '$PGPASSWORD';"
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $PGDATABASE TO $PGUSER;"
fi

# Start Node.js app
echo "Starting Node.js server..."
exec node src/server.js
