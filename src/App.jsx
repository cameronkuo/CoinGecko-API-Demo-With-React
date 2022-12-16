import React from "react";
import { ConfigProvider, Spin, theme } from "antd";
import Filters from "components/Filters";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";
import Table from "components/Table";
import TextArea from "antd/es/input/TextArea";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading__coins_markets: false,
			coinsMarkets: [],
			pagination: {
				page: 0,
				per_page: 25,
			},
		};
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
		this.setState({
			loading__coins_markets: true,
			pagination: {
				...this.state.pagination,
				page: this.state.pagination.page + 1,
			},
		});
		__api_getCoinsMarkets({
			...query,
			...this.state.pagination,
		}).then((res) => {
			this.setState({
				loading__coins_markets: false,
				coinsMarkets: this.state.coinsMarkets.concat(
					Array.isArray(res) ? res : []
				),
			});
		});
	}

	render() {
		return (
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				{/* <TextArea
					value={JSON.stringify(this.state.coinsMarkets, null, 4)}
					autoSize={{ minRows: 3, maxRows: 10 }}
				/> */}
				<Filters onSearch={this.getCoinsMarkets} />
				<Spin spinning={this.state.loading__coins_markets} size="large">
					<Table
						dataSource={this.state.coinsMarkets}
						pagination={this.state.pagination}
					/>
				</Spin>
			</ConfigProvider>
		);
	}
}

export default App;
