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

# Wait for the ppp0 interface to be fully up and assigned an IP
echo "Waiting for VPN connection to establish..."
for i in {1..20}; do
  if ip addr show ppp0 2>/dev/null | grep -q "inet "; then
    echo "VPN is UP and got an IP address!"
    break
  fi
  sleep 1
done

# What the documentation says:
# "IITG VPN IP segment: 172.18.0.0 | Subnet: 255.255.224.0"
# That subnet translates to /19 in CIDR notation.
ip route add 172.18.0.0/19 dev ppp0 || echo "172.18 subnet route failed"

# We MUST add a more specific (/32) route so the kernel prefers ppp0 over eth0 for the SFTP server
ip route add 172.17.1.141/32 dev ppp0 || echo "Route already exists or failed"

# Start the Node.js application
echo "Starting Node.js backend..."
node server.js
