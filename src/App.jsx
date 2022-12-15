import { ConfigProvider, theme } from "antd";

function App() {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		></ConfigProvider>
	);
}

export default App;
