import React from "react";
import { Spin } from "antd";
import numeral from "numeral";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";
// import TextArea from "antd/es/input/TextArea";
import Filters from "components/Filters";
import InfiniteScrollTable from "components/InfiniteScrollTable";
import Sparkline from "components/Sparkline";

const price_change_percentage = (val) => (
	<span className={val >= 0 ? "text-[#e15241]" : "text-[#23AF7D]"}>
		{numeral(val).format("0,0[.]0") + "%"}
	</span>
);

const columns = [
	{
		title: "",
		dataIndex: "image",
		className: [
			"sticky",
			"left-0",
			"!w-10",
			"bg-[var(--var-background-dark)]",
			"z-10",
		],
		render: (val, { name }) => (
			<img src={val} alt={name} className="!w-6 max-w-none" />
		),
	},
	{
		title: "Coin",
		dataIndex: "name",
		className: [
			"sticky",
			"left-10",
			"!w-60",
			"bg-[var(--var-background-dark)]",
			"z-10",
		],
		sortBy: {
			desc: "id_desc",
			asc: "id_asc",
		},
		render: (val, { symbol }) => `${val} (${symbol.toUpperCase()})`,
	},
	{
		title: "Price",
		dataIndex: "current_price",
		render: (val) => numeral(val).format("0,0.[0000000000]"),
	},
	{
		title: "1h",
		dataIndex: "price_change_percentage_1h_in_currency",
		render: price_change_percentage,
	},
	{
		title: "24h",
		dataIndex: "price_change_percentage_24h_in_currency",
		render: price_change_percentage,
	},
	{
		title: "7d",
		dataIndex: "price_change_percentage_7d_in_currency",
		render: price_change_percentage,
	},
	{
		title: "24 Volume",
		dataIndex: "total_volume",
		sortBy: {
			desc: "volume_desc",
			asc: "volume_asc",
		},
		render: (val) => numeral(val).format("0,0"),
	},
	{
		title: "Mkt Cap",
		dataIndex: "market_cap",
		sortBy: {
			desc: "market_cap_desc",
			asc: "market_cap_asc",
		},
		render: (val) => numeral(val).format(),
	},
	{
		title: "FDV",
		dataIndex: "fully_diluted_valuation",
	},
	{
		title: "Mkt Cap/FDV",
		dataIndex: "market_cap/FDV",
		render: (__, { market_cap, fully_diluted_valuation }) => {
			const divide = numeral(market_cap / fully_diluted_valuation).format(
				"0,0.00"
			);
			return divide === "NaN" ? "-" : divide;
		},
	},
	{
		title: "Last 7 Days",
		dataIndex: "sparkline_in_7d",
		render: (val) => <Sparkline data={val.price} />,
	},
];

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading__coins_markets: false,
			coinsMarkets: [],
			pagination: {
				page: 1,
				per_page: 25,
			},
			query: {
				vs_currency: "usd",
				ids: [],
				category: "",
				sparkline: true,
				order: "market_cap_desc",
				price_change_percentage: ["1h", "24h", "7d"],
			},
		};
		this.filterRef = React.createRef();
		this.getCoinsMarkets = this.getCoinsMarkets.bind(this);
	}

	componentDidMount() {
		this.pingByInterval();
	}

	pingByInterval() {
		__api_ping().then(() => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.pingByInterval();
			}, 10000);
		});
	}

	getCoinsMarkets() {
		return new Promise(async (resolve) => {
			this.setState(
				{
					loading__coins_markets: true,
				},
				() => {
					__api_getCoinsMarkets({
						...this.state.query,
						...this.state.pagination,
					}).then((res) => {
						this.setState(
							{
								loading__coins_markets: false,
								pagination: {
									...this.state.pagination,
									page: this.state.pagination.page + 1,
								},
								coinsMarkets: this.state.coinsMarkets.concat(
									Array.isArray(res) ? res : []
								),
							},
							() => {
								resolve(this.state.coinsMarkets);
							}
						);
					});
				}
			);
		});
	}

	render() {
		return (
			<>
				{/* <TextArea
					value={JSON.stringify(this.state.coinsMarkets, null, 4)}
					autoSize={{ minRows: 3, maxRows: 10 }}
				/> */}
				<Filters
					ref={this.filterRef}
					defaultQuery={this.state.query}
					onSearch={(query) => {
						this.setState(
							{
								coinsMarkets: [],
								pagination: {
									...this.state.pagination,
									page: 1,
								},
								query: {
									...this.state.query,
									...query,
								},
							},
							() => {
								this.getCoinsMarkets();
							}
						);
					}}
				/>
				<br />
				<br />
				<InfiniteScrollTable
					columns={columns}
					dataSource={this.state.coinsMarkets}
					height={500}
					fecthMethod={async () => await this.getCoinsMarkets()}
					loader={<Spin tip="Loading..." style={{ width: "100%" }} />}
					defaultSortBy={this.state.query.order}
					onSort={(order) => {
						this.setState(
							{
								coinsMarkets: [],
								pagination: {
									...this.state.pagination,
									page: 1,
								},
								query: {
									...this.state.query,
									order,
								},
							},
							() => {
								this.getCoinsMarkets();
							}
						);
					}}
				/>
			</>
		);
	}
}

export default App;
