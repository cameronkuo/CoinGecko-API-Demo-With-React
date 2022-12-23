import { Button, Select, Space, Switch } from "antd";
import React from "react";
import {
	__api_getCategoryList,
	__api_getCoinList,
	__api_getSupportedVsCurrencies,
} from "utils/api";

class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading__vs_currency: false,
			options__vs_currency: [],
			loading__coin_list: false,
			options__coin_list: [],
			loading__category_list: false,
			options__category_list: [],
			query: {
				vs_currency: props.vs_currency ?? "",
				ids: props.ids ?? [],
				category: props.category ?? "",
				sparkline: props.sparkline ?? true,
			},
		};
	}

	async componentDidMount() {
		this.setState({
			loading__vs_currency: true,
			loading__coin_list: true,
			loading__category_list: true,
		});
		const vs_currency = await this.getSupportedVsCurrencies().then(
			(res) => res[0]
		);
		await this.getCoinList();
		await this.getCategoryList();
		this.setState(
			{
				query: {
					...this.state.query,
					vs_currency,
				},
			},
			() => {
				this.props.onSearch(this.queryState);
			}
		);
	}

	get queryState() {
		return JSON.parse(JSON.stringify(this.state.query));
	}

	getSupportedVsCurrencies() {
		return __api_getSupportedVsCurrencies().then((res) => {
			this.setState({
				loading__vs_currency: false,
				options__vs_currency: res.map((value) => ({
					label: value.toUpperCase(),
					value,
				})),
			});
			return res;
		});
	}

	getCoinList(include_platform) {
		return __api_getCoinList({ include_platform }).then((res) => {
			this.setState({
				loading__coin_list: false,
				options__coin_list: res.map((item) => ({
					label: `${item.name} (${item.symbol})`,
					symbol: item.symbol,
					value: item.id,
				})),
			});
			return res;
		});
	}

	getCategoryList() {
		return __api_getCategoryList().then((res) => {
			this.setState({
				loading__category_list: false,
				options__category_list: res.map((item) => ({
					label: item.name,
					value: item.category_id,
				})),
			});
			return res;
		});
	}

	onChange(queryName, val) {
		this.setState({
			query: {
				...this.state.query,
				[queryName]: val,
			},
		});
	}

	render() {
		return (
			<Space wrap>
				<Select
					placeholder="選擇幣別"
					style={{
						width: 120,
					}}
					allowClear
					showSearch
					loading={this.state.loading__vs_currency}
					options={this.state.options__vs_currency}
					value={this.state.query.vs_currency}
					onChange={(val) => this.onChange("vs_currency", val)}
				/>
				<label>標記以包含平台合約地址</label>
				<Switch
					checkedChildren="是"
					unCheckedChildren="否"
					onChange={(include_platform) => {
						this.setState({
							query: {
								...this.state.query,
								ids: [],
							},
						});
						this.getCoinList(include_platform);
					}}
				/>
				<Select
					placeholder="選擇幣別"
					style={{
						width: 200,
					}}
					mode="multiple"
					allowClear
					loading={this.state.loading__coin_list}
					options={this.state.options__coin_list}
					value={this.state.query.ids}
					onChange={(val) => this.onChange("ids", val)}
				/>
				<Select
					placeholder="選擇類別"
					style={{
						width: 200,
					}}
					allowClear
					loading={this.state.loading__category_list}
					options={this.state.options__category_list}
					value={this.state.query.category}
					onChange={(val) => this.onChange("category", val)}
				/>
				<Button onClick={() => this.props.onSearch(this.queryState)}>
					搜尋
				</Button>
			</Space>
		);
	}
}

export default Filters;
