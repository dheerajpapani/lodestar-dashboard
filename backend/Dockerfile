FROM node:18-bullseye-slim

# Install OpenFortiVPN, psmisc, and dos2unix
RUN apt-get update && \
    apt-get install -y openfortivpn psmisc bash dos2unix iproute2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code including the start script
COPY . .

# Ensure the start script is executable and has LF line endings
RUN dos2unix start.sh && chmod +x start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start script handles VPN and Node app
CMD ["./start.sh"]
