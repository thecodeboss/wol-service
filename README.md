# WoL Service

A service that discovers devices on your network and provides a UI for waking them up using Wake-on-LAN.

## About

This project was built almost entirely using ChatGPT. This is not yet a production-quality project,
and caution should be used when running it.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher)

### Install

```bash
npm install
```

## Configuration

You must configure the service with an admin password, JWT secret, and a base IP for your local network.
Read the [Determining the Base IP](#determining-the-base-ip) section for more information on how to determine the base IP for your network.

A script is provided to make setting up these environment variables easy:

```bash
npm run configure
```

### Determining the Base IP

To determine the base IP address for your network, you can follow these steps for your specific operating system:

**For Windows:**

1. Press `Win + R` to open the Run dialog.
2. Type `cmd` and press Enter to open the Command Prompt.
3. Type `ipconfig` and press Enter.
4. Look for the network adapter you're using (usually "Wireless LAN adapter Wi-Fi" or "Ethernet adapter Ethernet").
5. Find the "IPv4 Address" field and note the IP address. The base IP address is the first three octets of this address (e.g., if the IPv4 address is 192.168.1.5, the base IP address is 192.168.1).

**For macOS and Linux:**

1. Open the Terminal.
2. For macOS, type `ifconfig` and press Enter. For Linux, you may need to type `ip addr`, `ifconfig` or `ip a` depending on the distribution.
3. Look for the network adapter you're using (usually named like "en0" or "en1" for macOS, and "eth0", "wlan0", or "enpXsY" for Linux).
4. Find the "inet" field and note the IP address. The base IP address is the first three octets of this address (e.g., if the inet address is 192.168.1.5, the base IP address is 192.168.1).

## Running

```bash
npm run dev
```
