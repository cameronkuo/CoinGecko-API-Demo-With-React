import axios from "utils/axios";
import querystring from "query-string";
import { notification } from "antd";
import { getCoinListSchema, getCoinsMarketsSchema } from "schema";

function queryStringify(data) {
	return querystring.stringify(data, {
		arrayFormat: "bracket",
		skipEmptyString: true,
		skipNull: true,
	});
}

function handleValidate(schema, data, callback) {
	return new Promise((resolve) => {
		const { value, error, warning } = schema.validate(data, {
			dateFormat: "date",
			stripUnknown: true,
			abortEarly: true,
			convert: true,
		});
		if (warning) {
			notification.warning({
				message: "API 參數警告",
				description: warning.message,
			});
		}
		if (error) {
			notification.error({
				message: "API 參數錯誤",
				description: error.message,
			});
		} else {
			resolve(callback(value));
		}
	});
}

// Check API server status
export function __api_ping() {
	return axios.get("/ping");
}

export function __api_getSupportedVsCurrencies() {
	return axios.get(`/simple/supported_vs_currencies`);
}

export function __api_getCoinsMarkets(query) {
	return handleValidate(getCoinsMarketsSchema, query, (validData) => {
		["ids", "price_change_percentage"].forEach((key) => {
			if (validData[key]?.length) validData[key] = validData[key].join();
		});
		return axios.get(`/coins/markets?${queryStringify(validData)}`);
	});
}

export function __api_getCoinList(query) {
	return handleValidate(getCoinListSchema, query, (validData) => {
		return axios.get(`/coins/list?${queryStringify(validData)}`);
	});
}

export function __api_getCategoryList() {
	return axios.get(`/coins/categories/list`);
}
