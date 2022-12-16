import React from "react";
import { ConfigProvider, Spin, theme } from "antd";
import Filters from "components/Filters";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";
import Table from "components/Table";
import InfiniteScroll from "react-infinite-scroll-component";
import TextArea from "antd/es/input/TextArea";

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
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				{/* <TextArea
					value={JSON.stringify(this.state.coinsMarkets, null, 4)}
					autoSize={{ minRows: 3, maxRows: 10 }}
				/> */}
				<Filters ref={this.filterRef} onSearch={this.getCoinsMarkets} />
				<Spin spinning={this.state.loading__coins_markets} size="large">
					<InfiniteScroll
						dataLength={this.state.coinsMarkets.length} //This is important field to render the next data
						next={async () =>
							await this.getCoinsMarkets(this.filterRef.current.queryState)
						}
						hasMore={true}
						loader={<h4>Loading...</h4>}
						endMessage={
							<p style={{ textAlign: "center" }}>
								<b>Yay! You have seen it all</b>
							</p>
						}
						// below props only if you need pull down functionality
						refreshFunction={() => {
							this.getCoinsMarkets(this.filterRef.current.queryState);
						}}
						pullDownToRefresh
						pullDownToRefreshThreshold={1000}
						pullDownToRefreshContent={
							<h3 style={{ textAlign: "center" }}>
								&#8595; Pull down to refresh
							</h3>
						}
						releaseToRefreshContent={
							<h3 style={{ textAlign: "center" }}>
								&#8593; Release to refresh
							</h3>
						}
					>
						<Table
							dataSource={this.state.coinsMarkets}
							pagination={this.state.pagination}
						/>
					</InfiniteScroll>
				</Spin>
			</ConfigProvider>
		);
	}
}

export default App;
