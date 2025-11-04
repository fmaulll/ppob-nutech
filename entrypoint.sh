#!/bin/bash
set -e

echo "Environment check: PGUSER=$PGUSER, PGDATABASE=$PGDATABASE"

# Ensure Postgres data directory exists
if [ ! -d "/var/lib/postgresql/15/main" ]; then
  echo "Initializing PostgreSQL data directory..."
  pg_ctl initdb -D /var/lib/postgresql/15/main
fi

# Temporarily switch PostgreSQL auth to trust for setup
echo "Temporarily switching PostgreSQL auth to trust..."
sed -i "s/^#\?host\s\+all\s\+all\s\+127.0.0.1\/32\s\+.*$/host all all 127.0.0.1\/32 trust/" /etc/postgresql/15/main/pg_hba.conf
sed -i "s/^#\?host\s\+all\s\+all\s\+::1\/128\s\+.*$/host all all ::1\/128 trust/" /etc/postgresql/15/main/pg_hba.conf

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
service postgresql start

# Wait until Postgres is ready
until pg_isready -h localhost -p 5432 > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 1
done

# Set postgres password (if not already)
echo "Setting postgres password..."
psql -U postgres -d postgres -c "ALTER USER postgres PASSWORD '${PGPASSWORD}';" || true

# Create the app database if it doesn’t exist
DB_EXIST=$(psql -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${PGDATABASE}'")
if [ "$DB_EXIST" != "1" ]; then
  echo "Creating database ${PGDATABASE}..."
  psql -U postgres -d postgres -c "CREATE DATABASE ${PGDATABASE};"
else
  echo "Database ${PGDATABASE} already exists."
fi

# Apply schema (safe even if tables exist)
if [ -f "/app/db/schema.sql" ]; then
  echo "Applying schema to database ${PGDATABASE}..."
  psql -U postgres -d "${PGDATABASE}" -f /app/db/schema.sql || true
else
  echo "⚠️ No schema.sql found at /app/db/schema.sql — skipping."
fi

# Switch PostgreSQL auth back to md5 for security
echo "Switching PostgreSQL auth back to md5..."
sed -i "s/^host\s\+all\s\+all\s\+127.0.0.1\/32\s\+trust/host all all 127.0.0.1\/32 md5/" /etc/postgresql/15/main/pg_hba.conf
sed -i "s/^host\s\+all\s\+all\s\+::1\/128\s\+trust/host all all ::1\/128 md5/" /etc/postgresql/15/main/pg_hba.conf

# Restart PostgreSQL to apply changes
service postgresql restart

# Start Node.js app
echo "Starting Node.js server..."
exec node src/server.js
