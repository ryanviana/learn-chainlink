const ethers = await import("npm:ethers@6.10.0");

const timestamp = args[0];

const URL = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=` + timestamp;

const apiResponse = await Functions.makeHttpRequest({
  url: URL,
});

if (apiResponse.error) {
  console.error(apiResponse.error);
  throw Error("Request failed");
}

const data = apiResponse.data;

if (!data || data.ETH.USD === undefined) {
  console.error("ETH price data is missing from the response");
  throw Error("Invalid response data");
}

const ethPrice = Math.round(data.ETH.USD * 10 ** 4);

const encoded = ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [ethPrice, timestamp]);

return ethers.getBytes(encoded);
