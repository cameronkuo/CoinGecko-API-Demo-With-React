import React from "react";
import { ConfigProvider, theme } from "antd";
import Filters from "components/Filters";
import { __api_getCoinsMarkets, __api_ping } from "utils/api";

class App extends React.Component {
	constructor(props) {
		super(props);
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
		__api_getCoinsMarkets({
			...query,
		}).then((res) => {
			console.log(res);
		});
	}

	render() {
		return (
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				<Filters onSearch={this.getCoinsMarkets} />
			</ConfigProvider>
		);
	}
}

export default App;
