import { Select, Space, Switch } from "antd";
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
				vs_currency: props.defaultQuery?.vs_currency ?? "",
				ids: props.defaultQuery?.ids ?? [],
				category: props.defaultQuery?.category ?? "",
				sparkline: props.defaultQuery?.sparkline ?? true,
			},
		};
	}

	async componentDidMount() {
		this.setState({
			loading__vs_currency: true,
			loading__coin_list: true,
			loading__category_list: true,
		});
		await this.getSupportedVsCurrencies();
		await this.getCoinList();
		await this.getCategoryList();
		this.props.onSearch(this.queryState);
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
		this.setState(
			{
				query: {
					...this.state.query,
					[queryName]: val,
				},
			},
			() => {
				this.props.onSearch(this.queryState);
			}
		);
	}

	render() {
		return (
			<Space wrap align="start" size="large" className="p-2">
				<Space className="flex flex-col items-start">
					<label>相對應價格之貨幣</label>
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
				</Space>
				<Space className="flex flex-col items-start">
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
				</Space>
				<Space className="flex flex-col items-start">
					<label>篩選欲顯示之幣別</label>
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
				</Space>
				<Space className="flex flex-col items-start">
					<label>篩選類別</label>
					<Select
						placeholder="選擇類別"
						style={{
							width: 200,
						}}
						allowClear
						showSearch
						loading={this.state.loading__category_list}
						options={this.state.options__category_list}
						value={this.state.query.category}
						onChange={(val) => this.onChange("category", val)}
					/>
				</Space>
			</Space>
		);
	}
}

export default Filters;
