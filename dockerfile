# Use official Node.js image as base
FROM node:20

# Install Postgres
RUN apt-get update && apt-get install -y postgresql postgresql-contrib sudo && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 5000 5432

# Start entrypoint
CMD ["/entrypoint.sh"]
