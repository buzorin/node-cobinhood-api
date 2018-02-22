[![NPM](https://nodei.co/npm/node-cobinhood-api.png?compact=true)](https://npmjs.org/package/node-cobinhood-api)

# Node Cobinhood API
A simple to use Node.js library for Cobinhood The World's First ZERO Trading Fees Cryptocurrency Exchange.

#### Installation
```js
npm install node-cobinhood-api
```

#### Getting started
```js
const cobinhood = require('node-cobinhood-api');
cobinhood.options({
	'apiKey': '<api key>'
});
```

#### Get latest price of a symbol
```js
cobinhood.lastPrice("COB-BTC", (error, lastPrice) => {
	if (!error) {
		console.log("COB-BTC last price:", lastPrice);
		// COB-BTC last price: 0.00001687
	}
});
```

#### Get depth of a symbol
```js
let limit = 10; // Optional. Defaults to 50 if not specified, if limit is 0, it means to fetch the whole order book.
cobinhood.orderBook("COB-BTC", (error, orderBook) => {
	if (!error) {
		console.log(orderBook);
	}
}, limit);
```

<details>
<summary>Response</summary>

```js
{ sequence: 0, // A sequence number that is updated on each orderbook state change
  bids: 
   [ { price: '0.00001615', orders: '1', quantity: '2000' },
     { price: '0.00001611', orders: '2', quantity: '1643.07076472' },
     { price: '0.0000161', orders: '2', quantity: '2137.4987851' },
     { price: '0.00001602', orders: '3', quantity: '4051.77902621' },
     { price: '0.00001601', orders: '3', quantity: '54500' },
     { price: '0.000016', orders: '1', quantity: '200' },
     { price: '0.00001599', orders: '1', quantity: '200' },
     { price: '0.00001598', orders: '1', quantity: '200' },
     { price: '0.00001597', orders: '1', quantity: '200' },
     { price: '0.00001596', orders: '1', quantity: '200' } ],
  asks: 
   [ { price: '0.0000166', orders: '1', quantity: '427.29060805' },
     { price: '0.00001688', orders: '1', quantity: '600' },
     { price: '0.00001691', orders: '2', quantity: '5136.79420461' },
     { price: '0.0000173', orders: '1', quantity: '2000' },
     { price: '0.00001731', orders: '1', quantity: '8656.09357823' },
     { price: '0.00001733', orders: '1', quantity: '572' },
     { price: '0.00001734', orders: '1', quantity: '690.98028617' },
     { price: '0.00001735', orders: '2', quantity: '1909.65293563' },
     { price: '0.0000174', orders: '1', quantity: '623.56476684' },
     { price: '0.00001741', orders: '1', quantity: '500' } ] }
```
</details>

#### Get All Currencies
Returns info for all currencies available for trade
```js
cobinhood.currencies((error, currencies) => {
	if (!error) {
		console.log(currencies);
	}
});
```

<details>
<summary>Response</summary>

```js
[ { currency: 'BTC',
    name: 'Bitcoin',
    min_unit: '0.00000001',
    deposit_fee: '0',
    withdrawal_fee: '0.001' },
  { currency: 'COB',
    name: 'Cobinhood Token',
    min_unit: '0.00000001',
    deposit_fee: '0',
    withdrawal_fee: '43.39' },
    ...
]
```
</details>

#### Get info for all trading pairs
```js
cobinhood.tradingPairs((error, tradingPairs) => {
	if (!error) {
		console.log(tradingPairs);
	}
});
```

<details>
<summary>Response</summary>

```js
[ { id: 'COB-BTC',
    base_currency_id: 'COB',
    quote_currency_id: 'BTC',
    base_max_size: '5165662.806',
    base_min_size: '154.969',
    quote_increment: '0.00000001' },
  { id: 'COB-ETH',
    base_currency_id: 'COB',
    quote_currency_id: 'ETH',
    base_max_size: '5165662.806',
    base_min_size: '154.969',
    quote_increment: '0.0000001' },
    ...
]
```
</details>

#### Get trading statistics
```js
cobinhood.stats((error, stats) => {
	if (!error) {
		console.log(stats);
	}
});
```

<details>
<summary>Response</summary>

```js
{ 'COB-BTC': 
   { id: 'COB-BTC',
     last_price: '0.00001611',
     lowest_ask: '0.0000161',
     highest_bid: '0.00001779',
     base_volume: '320442.45023293',
     quote_volume: '5.4801039201211806',
     is_frozen: false,
     high_24hr: '0.00001894',
     low_24hr: '0.0000161',
     percent_changed_24hr: '-0.070398153491056' },
  'COB-ETH': 
   { id: 'COB-ETH',
     last_price: '0.0002008',
     lowest_ask: '0.0002007',
     highest_bid: '0.0002202',
     base_volume: '822814.89034178',
     quote_volume: '174.865914947356928',
     is_frozen: false,
     high_24hr: '0.0002243',
     low_24hr: '0.0002004',
     percent_changed_24hr: '-0.0664807066480707' },
  ...
}
```
</details>

#### Get ticker
Returns ticker for specified trading pair
```js
cobinhood.ticker("COB-BTC", (error, ticker) => {
	if (!error) {
		console.log(ticker);
	}
});
```

<details>
<summary>Response</summary>

```js
{ trading_pair_id: 'COB-BTC',
  timestamp: 1519307340000,
  '24h_high': '0.00001894',
  '24h_low': '0.0000161',
  '24h_open': '0.00001734',
  '24h_volume': '321346.24401148',
  last_trade_price: '0.00001611',
  highest_bid: '0.00001612',
  lowest_ask: '0.0000163' }
```
</details>

#### Get recent trades
Returns most recent trades for the specified trading pair
```js
let limit = 2; // Optional. Defaults to 20 if not specified, maximum 50.
cobinhood.trades("COB-BTC", (error, trades) => {
	if (!error) {
		console.log(trades);
	}
}, limit);
```

<details>
<summary>Response</summary>

```js
[ { id: 'ff41c738-4ee3-4c43-84c0-d448adb4344b',
    maker_side: 'ask',
    timestamp: 1519295760515,
    price: '0.0000171',
    size: '435.97269025' },
  { id: '3d30dd75-a70e-46db-955b-3dd5b9334a9e',
    maker_side: 'bid',
    timestamp: 1519295474495,
    price: '0.0000171',
    size: '159.25555556' } ]
```
</details>

#### Get candles
Returns charting candles for the specified trading pair
```js
let timeframe = '5m'; // Timeframes: 1m, 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1D, 7D, 14D, 1M
let startTime = 1519307723000; // Optional. Unix timestamp in milliseconds. Defaults to 0 if not specified.
let endTime   = 1519308723000; // Optional. Unix timestamp in milliseconds. Defaults to current server time if not specified.
cobinhood.candles("COB-BTC", timeframe, (error, candles) => {
	if (!error) {
		console.log(candles);
	}
}, endTime, startTime);
```

<details>
<summary>Response</summary>

```js
[ { timeframe: '5m',
    trading_pair_id: 'COB-BTC',
    timestamp: 1519307700000,
    volume: '0',
    open: '0.0000162',
    close: '0.0000162',
    high: '0.0000162',
    low: '0.0000162' },
  { timeframe: '5m',
    trading_pair_id: 'COB-BTC',
    timestamp: 1519308000000,
    volume: '0',
    open: '0.0000162',
    close: '0.0000162',
    high: '0.0000162',
    low: '0.0000162' },
  { timeframe: '5m',
    trading_pair_id: 'COB-BTC',
    timestamp: 1519308300000,
    volume: '814.81238504',
    open: '0.0000163',
    close: '0.00001631',
    high: '0.00001631',
    low: '0.0000163' },
  { timeframe: '5m',
    trading_pair_id: 'COB-BTC',
    timestamp: 1519308600000,
    volume: '0',
    open: '0.00001631',
    close: '0.00001631',
    high: '0.00001631',
    low: '0.00001631' } ]
```
</details>
