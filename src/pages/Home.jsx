import React from "react";
import { Spin } from "antd";
import numeral from "numeral";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";
import TextArea from "antd/es/input/TextArea";
import Filters from "components/Filters";
import InfiniteScrollTable from "components/InfiniteScrollTable";
import Sparkline from "components/Sparkline";

const columns = [
	{
		title: "",
		dataIndex: "image",
		width: "100px",
		className: ["sticky", "left-0", "bg-[var(--var-background-dark)]", "z-10"],
		render: (val, { name }) => <img src={val} alt={name} className="w-8" />,
	},
	{
		title: "Coin",
		dataIndex: "name",
		width: "200px",
		className: [
			"sticky",
			"left-[100px]",
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
		title: "匯率",
		dataIndex: "current_price",
		width: "150px",
		render: (val) => numeral(val).format("0,0.[0000000000]"),
	},
	{
		title: "24小時交易量",
		dataIndex: "total_volume",
		width: "150px",
		render: (val) => numeral(val).format("0,0.[00000]"),
	},
	{
		title: "24小時匯率變化",
		dataIndex: "price_change_percentage_24h",
		width: "150px",
	},
	{
		title: "總市值",
		dataIndex: "market_cap",
		width: "150px",
		sortBy: {
			desc: "market_cap_desc",
			asc: "market_cap_asc",
		},
		render: (val) => numeral(val).format(),
	},
	{
		title: "最近７天",
		dataIndex: "sparkline_in_7d",
		width: "150px",
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
				<TextArea
					value={JSON.stringify(this.state.coinsMarkets, null, 4)}
					autoSize={{ minRows: 3, maxRows: 10 }}
				/>
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
