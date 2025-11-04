# Use official Node.js image
FROM node:20

# Install Postgres
RUN apt-get update && apt-get install -y postgresql postgresql-contrib && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose Node.js port (5000) and Postgres port (5432)
EXPOSE 5000 5432

# Start entrypoint
CMD ["/entrypoint.sh"]
