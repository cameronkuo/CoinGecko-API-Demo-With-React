import { ConfigProvider, theme } from "antd";
import { __api_getCoinsMarkets } from "utils/api";

function App() {
	__api_getCoinsMarkets({
		vs_currency: "usd",
	}).then((res) => {
		console.log(res);
	});
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		></ConfigProvider>
	);
}

export default App;
