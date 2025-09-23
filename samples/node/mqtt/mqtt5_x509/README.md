# MQTT5 X509 Sample (mTLS)

This sample demonstrates how to connect to AWS IoT Core using MQTT5 with X.509 certificates for mutual TLS authentication.

## Prerequisites

* Node.js v14+
* AWS IoT Thing with certificate and private key
* AWS IoT endpoint

## Installation

```bash
npm install
```

## Usage

```bash
node index.js --endpoint <your-iot-endpoint> --cert <path-to-cert> --key <path-to-key>
```

### Required Arguments

* `--endpoint` - Your AWS IoT endpoint hostname
* `--cert` - Path to the certificate file for mTLS connection
* `--key` - Path to the private key file for mTLS connection

### Optional Arguments

* `--client_id` - Client ID (default: auto-generated)
* `--topic` - Topic to publish/subscribe (default: "test/topic")
* `--message` - Message payload (default: "Hello from mqtt5 sample")
* `--count` - Number of messages to publish (default: 5, 0 = infinite)

## Example

```bash
node index.js \
  --endpoint a1b2c3d4e5f6g7-ats.iot.us-east-1.amazonaws.com \
  --cert ./certificates/device.pem.crt \
  --key ./certificates/private.pem.key \
  --topic "my/test/topic" \
  --count 10
```