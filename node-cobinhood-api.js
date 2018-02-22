/* ============================================================
 * node-cobinhood-api
 * https://github.com/buzorin/node-cobinhood-api
 * ============================================================
 * Copyright 2018-, Konstantin Buzorin
 * Released under the MIT License
 * ============================================================ */

module.exports = function() {
	'use strict';
	const request   = require('request');
	const WebSocket = require('ws');
	const baseUrl   = 'https://api.cobinhood.com';
	const streamUrl = 'wss://feed.cobinhood.com/ws';
	
	const defaultOptions = {
		requestTimeout: 30000
	};

	let options = defaultOptions;

	const defaultRequestOpt = {
		method: 'GET',
		qs: {},
		headers: {
			'User-Agent': 'Mozilla/4.0 (compatible; Node Cobinhood API)',
			'Content-type': 'application/x-www-form-urlencoded'
		},
		timeout: options.requestTimeout
	};

	const placeOrder = function(symbol, price, quantity, side, type, callback) {
		let opt = defaultRequestOpt;
			opt.method = 'POST';
			opt.url = baseUrl+'/v1/trading/orders';
			opt.json = {
				'trading_pair_id': symbol,
				'side': side,
				'type': type,
				'price': price.toString(),
				'size': quantity.toString()
			};
			opt.headers.authorization = options.apiKey;
			opt.headers.nonce = (new Date()).getTime();
		
		request(opt, function(error, response, body) {
			if (error)
				return callback(error);

			if (response && response.statusCode !== 200)
				return callback(response.body.error.error_code);

			let result = body.result.order;
			return callback(false, result);
		});
	};

	return {
		options: function(opts) {
			for (let opt in opts) {
				options[opt] = opts[opt];
			}
		},
		currencies: function(callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/currencies';

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.currencies;
				return callback(false, result);
			});
		},
		tradingPairs: function(callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/trading_pairs';

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.trading_pairs;
				return callback(false, result);
			});
		},
		orderBook: function(symbol, callback, limit = 50) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/orderbooks/'+symbol;
				opt.qs.limit = limit;

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let orderbook = JSON.parse(body).result.orderbook;
				let result = {
					'sequence': orderbook.sequence,
					'bids': [],
					'asks': []
				};

				orderbook.bids.forEach(function(bid){
					result.bids.push({
						'price': bid[0],
						'orders': bid[1],
						'quantity': bid[2]
					});
				});

				orderbook.asks.forEach(function(ask){
					result.asks.push({
						'price': ask[0],
						'orders': ask[1],
						'quantity': ask[2]
					});
				});

				return callback(false, result);
			});
		},
		stats: function(callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/stats';

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result;
				return callback(false, result);
			});
		},
		ticker: function(symbol, callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/tickers/'+symbol;

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.ticker;
				return callback(false, result);
			});
		},
		lastPrice: function(symbol, callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/tickers/'+symbol;

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.ticker.last_trade_price;
				return callback(false, result);
			});
		},
		trades: function(symbol, callback, limit = 20) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/market/trades/'+symbol;
				opt.qs.limit = limit;

			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.trades;
				return callback(false, result);
			});
		},
		candles: function(symbol, timeframe, callback, endTime = false, startTime = false) { // Timeframes: 1m, 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1D, 7D, 14D, 1M
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/chart/candles/'+symbol;
				opt.qs.timeframe = timeframe;

			if (endTime) opt.qs.end_time = endTime;
			if (startTime) opt.qs.start_time = startTime;
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.candles;
				return callback(false, result);
			});
		},
		orderStatus: function(orderId, callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/trading/orders/'+orderId;
				opt.headers.authorization = options.apiKey;
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.order;
				return callback(false, result);
			});
		},
		orderTrades: function(orderId, callback) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/trading/orders/'+orderId+'/trades';
				opt.headers.authorization = options.apiKey;
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.trades;
				return callback(false, result);
			});
		},
		orders: function(symbol, callback, limit = 20) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/trading/orders';
				opt.qs.trading_pair_id = symbol;
				opt.qs.limit = limit;
				opt.headers.authorization = options.apiKey;
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.orders;
				return callback(false, result);
			});
		},
		ordersAll: function(callback, limit = 20) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/trading/orders';
				opt.qs.limit = limit;
				opt.headers.authorization = options.apiKey;
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.orders;
				return callback(false, result);
			});
		},
		orderCancel: function(orderId, callback) {
			let opt = defaultRequestOpt;
				opt.method = 'DELETE';
				opt.url = baseUrl+'/v1/trading/orders/'+orderId;
				opt.headers.authorization = options.apiKey;
				opt.headers.nonce = (new Date()).getTime();
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).success;
				return callback(false, body);
			});
		},
		orderHistory: function(symbol, callback, limit = 50) {
			let opt = defaultRequestOpt;
				opt.url = baseUrl+'/v1/trading/order_history';
				opt.qs.trading_pair_id = symbol;
				opt.qs.limit = limit;
				opt.headers.authorization = options.apiKey;
			
			request(opt, function(error, response, body) {
				if (error)
					return callback(error);

				if (response && response.statusCode !== 200)
					return callback(JSON.parse(response.body).error.error_code);

				let result = JSON.parse(body).result.orders;
				return callback(false, result);
			});
		},
		limitBuy: function(symbol, price, quantity, callback) {
			placeOrder(symbol, price, quantity, 'bid', 'limit', callback);
		},
		limitSell: function(symbol, price, quantity, callback) {
			placeOrder(symbol, price, quantity, 'ask', 'limit', callback);
		},
		marketBuy: function(symbol, quantity, callback) {
			placeOrder(symbol, '', quantity, 'bid', 'market', callback);
		},
		marketSell: function(symbol, quantity, callback) {
			placeOrder(symbol, '', quantity, 'ask', 'market', callback);
		}
	};
}();