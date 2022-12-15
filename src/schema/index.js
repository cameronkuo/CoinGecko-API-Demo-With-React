import joi from "joi";

export const getCoinsMarketsSchema = joi.object({
	vs_currency: joi.string().required(),
	ids: joi.string().allow(""),
	category: joi.string().allow(""),
	order: joi
		.string()
		.allow(
			"gecko_desc",
			"gecko_asc",
			"market_cap_asc",
			"market_cap_desc",
			"volume_asc",
			"volume_desc",
			"id_asc",
			"id_desc"
		)
		.allow(""),
	per_page: joi.number().min(1).max(250),
	page: joi.number(),
	sparkline: joi.boolean(),
	price_change_percentage: joi
		.array()
		.items(joi.string().allow("1h", "24h", "7d", "14d", "30d", "200d", "1y")),
});
