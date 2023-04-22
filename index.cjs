const RPChCrypto = require("@rpch/crypto");
const SDK = require("@rpch/sdk").default;


async function setKeyVal(key, val) {
  localStorage.setItem(key, val);
}

async function getKeyVal(key) {
  return localStorage.getItem(key);
}

// Initialize the SDK
const sdk = new SDK(
  {
    crypto: RPChCrypto,
    client: "your_client_name",
    timeout: 20000,
    discoveryPlatformApiEndpoint: "https://staging.discovery.rpch.tech",
  },
  setKeyVal,
  getKeyVal
);

// Function to get the latest block
async function getLatestBlock() {
  await sdk.start();

  // Create and send a request to get the latest block number
  const blockNumberRequest = await sdk.createRequest(
    "ethereum",
    JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] })
  );
  const blockNumberResponse = await sdk.sendRequest(blockNumberRequest);
  const blockNumber = parseInt(blockNumberResponse.body.result, 16);

  // Create and send a request to get the block details
  const blockDetailsRequest = await sdk.createRequest(
    "provider",
    JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "eth_getBlockByNumber",
      params: [blockNumber, true],
    })
  );
  const blockDetailsResponse = await sdk.sendRequest(blockDetailsRequest);

  await sdk.stop();

  return JSON.parse(blockDetailsResponse.body.result);
}

getLatestBlock()
  .then((blockDetails) => console.log("Latest Block Details:", blockDetails))
  .catch((error) => console.error("Error fetching block details:", error));
