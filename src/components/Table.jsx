import React from "react";
import { Table } from "antd";

const columns = [
	{
		title: "",
		dataIndex: "image",
		render: (image, { name }) => <img src={image} alt={name} width="30" />,
	},
	{
		title: "名稱",
		dataIndex: "name",
	},
	{
		title: "Market Cap",
		dataIndex: "market_cap",
	},
	{
		title: "Total Volumn",
		dataIndex: "total_volume",
	},
];

const App = (props) => {
	return (
		<Table
			rowKey="id"
			pagination={{
				pageSize: props.dataSource.length,
				total: props.dataSource.length,
				// position: ["none"],
			}}
			columns={columns}
			dataSource={props.dataSource}
		/>
	);
};

export default App;
