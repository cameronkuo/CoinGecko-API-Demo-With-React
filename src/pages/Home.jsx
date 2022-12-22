import React from "react";
import { Spin } from "antd";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";
// import TextArea from "antd/es/input/TextArea";
import Filters from "components/Filters";
import InfiniteScrollTable from "components/InfiniteScrollTable";
import Sparkline from "components/Sparkline";

const columns = [
	{
		title: "",
		dataIndex: "image",
		render: (image, { name }) => <img src={image} alt={name} width="30" />,
	},
	{
		title: "名稱",
		dataIndex: "name",
	},
	{
		title: "匯率",
		dataIndex: "current_price",
	},
	{
		title: "24小時交易量",
		dataIndex: "total_volume",
	},
	{
		title: "24小時匯率變化",
		dataIndex: "price_change_percentage_24h",
	},
	{
		title: "總市值",
		dataIndex: "market_cap",
	},
	{
		title: "最近７天",
		dataIndex: "sparkline_in_7d",
		render: (sparkline_in_7d) => <Sparkline data={sparkline_in_7d.price} />,
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

	getCoinsMarkets(query) {
		return new Promise(async (resolve) => {
			await this.setState({
				loading__coins_markets: true,
			});
			__api_getCoinsMarkets({
				...query,
				...this.state.pagination,
			}).then((res) => {
				setTimeout(() => {
					this.setState({
						loading__coins_markets: false,
						pagination: {
							...this.state.pagination,
							page: this.state.pagination.page + 1,
						},
						coinsMarkets: this.state.coinsMarkets.concat(
							Array.isArray(res) ? res : []
						),
					});
					resolve(this.state.coinsMarkets);
				}, 1000);
			});
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
					onSearch={(query) => {
						this.setState({
							coinsMarkets: [],
							pagination: {
								...this.state.pagination,
								page: 1,
							},
						});
						this.getCoinsMarkets(query);
					}}
				/>
				<InfiniteScrollTable
					columns={columns}
					dataSource={this.state.coinsMarkets}
					height={500}
					fecthMethod={async () =>
						await this.getCoinsMarkets(this.filterRef.current.queryState)
					}
					loader={<Spin tip="Loading..." style={{ width: "100%" }} />}
				/>
			</>
		);
	}
}

export default App;
