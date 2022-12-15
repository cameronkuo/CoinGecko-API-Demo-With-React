import axios from "utils/axios";
import querystring from "query-string";

function queryStringify(data) {
	return querystring.stringify(data, {
		arrayFormat: "bracket",
		skipEmptyString: true,
		skipNull: true,
	});
}

export function __api_getCoinsMarkets(query) {
	return axios.get(`/coins/markets?${queryStringify(query)}`);
}
