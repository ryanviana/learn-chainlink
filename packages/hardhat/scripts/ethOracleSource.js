const apiResponse = await Functions.makeHttpRequest({
  url: `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`,
});

if (apiResponse.error) {
  console.error(apiResponse.error);
  throw Error("Request failed");
}

const data = apiResponse.data;

if (!data || data.USD === undefined) {
  console.error("ETH price data is missing from the response");
  throw Error("Invalid response data");
}

const ethPrice = Math.round(data.USD * 10 ** 18);

return Functions.encodeUint256(ethPrice);
