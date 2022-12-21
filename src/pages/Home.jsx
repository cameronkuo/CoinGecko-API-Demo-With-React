import React from "react";
import { Spin } from "antd";
import Filters from "components/Filters";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";
import InfiniteScrollTable from "components/InfiniteScrollTable";
import TextArea from "antd/es/input/TextArea";

// interface DataType {
// 	ath: number;
// 	ath_change_percentage: number;
// 	ath_date: string;
// 	atl: number;
// 	atl_change_percentage: number;
// 	atl_date: string;
// 	circulating_supply: number;
// 	current_price: number;
// 	fully_diluted_valuation: number;
// 	high_24h: number;
// 	id: string;
// 	image: string;
// 	last_updated: string;
// 	low_24h: number;
// 	market_cap: number;
// 	market_cap_change_24h: number;
// 	market_cap_change_percentage_24h: number;
// 	market_cap_rank: number;
// 	max_supply: number | null;
// 	name: string;
// 	price_change_24h: number;
// 	price_change_percentage_24h: number;
// 	roi: {
// 		currency: string,
// 		percentage: number,
// 		times: number,
// 	} | null;
// 	symbol: string;
// 	total_supply: number;
// 	total_volume: number;
// }

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
		title: "Market Cap",
		dataIndex: "market_cap",
	},
	{
		title: "Total Volumn",
		dataIndex: "total_volume",
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
