import axios from "utils/axios";
import querystring from "query-string";
import { notification } from "antd";
import { getCoinsMarketsSchema } from "schema";

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

export function __api_getCoinsMarkets(query) {
	return handleValidate(getCoinsMarketsSchema, query, (validData) => {
		const { price_change_percentage } = validData;
		if (price_change_percentage?.length)
			validData.price_change_percentage = price_change_percentage.join();
		return axios.get(`/coins/markets?${queryStringify(validData)}`);
	});
}
