import { ConfigProvider, theme } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { __api_getCoinsMarkets } from "utils/api";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response: null,
		};
	}
	componentDidMount() {
		__api_getCoinsMarkets({
			vs_currency: "usd",
			ids: "",
			category: "",
			order: "",
			per_page: 25,
			page: 1,
			// sparkline: false,
			// price_change_percentage: [],
		}).then((res) => {
			this.setState({
				response: res,
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
				<TextArea
					value={JSON.stringify(this.state.response, null, 4)}
					autoSize={{ minRows: 2, maxRows: 10 }}
				/>
			</ConfigProvider>
		);
	}
}

export default App;
