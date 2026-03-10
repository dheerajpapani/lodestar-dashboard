#!/bin/bash

# Ensure required environment variables are set
if [ -z "$VPN_USER" ] || [ -z "$VPN_PASSWORD" ]; then
  echo "ERROR: VPN_USER and VPN_PASSWORD must be set in environment variables."
  exit 1
fi

echo "Starting OpenFortiVPN for IITG (agnigarh.iitg.ac.in:10443)..."

# Create a config file for openfortivpn targeting the IITG VPN
cat <<EOF > /etc/openfortivpn/config
host = agnigarh.iitg.ac.in
port = 10443
username = $VPN_USER
password = $VPN_PASSWORD
set-dns = 0
set-routes = 0
EOF

# If a trusted cert is provided, append it to the config
if [ -n "$VPN_TRUSTED_CERT" ]; then
  echo "trusted-cert = $VPN_TRUSTED_CERT" >> /etc/openfortivpn/config
fi

# Run openfortivpn in the background
openfortivpn -c /etc/openfortivpn/config &

# Give the VPN a few seconds to establish the ppp0 connection
echo "Waiting 10 seconds for VPN connection to establish..."
sleep 10

# Manually route ONLY the IITG internal IPs through the VPN, leaving the rest of the AWS internet connection alone
ip route add 172.17.0.0/16 dev ppp0 || echo "Route already exists or failed"

# Start the Node.js application
echo "Starting Node.js backend..."
node server.js
