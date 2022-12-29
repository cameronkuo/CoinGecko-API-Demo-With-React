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
			<main className="max-w-7xl m-auto px-5 py-[5%]">
				<Outlet />
			</main>
		</ConfigProvider>
	);
}

export default App;
