import React from "react";
import { ConfigProvider, theme } from "antd";
import Filters from "components/Filters";
import { __api_ping } from "utils/api";

class App extends React.Component {
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

	render() {
		return (
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				<Filters />
			</ConfigProvider>
		);
	}
}

export default App;
