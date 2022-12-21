import React from "react";
import { ConfigProvider, theme } from "antd";
import { Outlet } from "react-router-dom";

function App() {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<Outlet />
		</ConfigProvider>
	);
}

export default App;
