import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
const tableStyle = {
	width: "100%",
	tableLayout: "fixed",
};

const App = (props) => {
	const { defaultSortBy, onSort } = props;
	const [sortBy, setSortBy] = useState(`${defaultSortBy}` ?? "");

	useEffect(() => {
		if (sortBy !== defaultSortBy) onSort(sortBy);
	}, [sortBy]);

	return (
		<div>
			<table style={tableStyle}>
				<thead>
					<tr>
						{props.columns.map((column) => (
							<th
								key={column.dataIndex}
								className={`p-2 ${column.sortBy ? "cursor-pointer" : ""}`}
								onClick={() => {
									if (sortBy === column.sortBy.desc)
										setSortBy(column.sortBy.asc);
									else if (sortBy === column.sortBy.asc) setSortBy("");
									else setSortBy(column.sortBy.desc);
								}}
							>
								{column.title}&nbsp;
								{column.sortBy?.desc === sortBy ? <CaretDownFilled /> : null}
								{column.sortBy?.asc === sortBy ? <CaretUpFilled /> : null}
							</th>
						))}
					</tr>
				</thead>
			</table>

			<InfiniteScroll
				dataLength={props.dataSource.length} //This is important field to render the next data
				next={props.fecthMethod}
				scrollThreshold={0.99}
				hasMore={true}
				height={props.height}
				loader={props.loader}
				endMessage={
					<p style={{ textAlign: "center" }}>
						<b>沒有更多資料</b>
					</p>
				}
				// below props only if you need pull down functionality
				refreshFunction={props.fecthMethod}
				pullDownToRefresh
				pullDownToRefreshContent={
					<h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
				}
				releaseToRefreshContent={
					<h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
				}
			>
				<table style={tableStyle}>
					<tbody>
						{props.dataSource.map((row) => (
							<tr key={row.id}>
								{props.columns.map((column) => (
									<td key={column.dataIndex} className="p-1 text-center">
										{typeof column.render === "function"
											? column.render(row[column.dataIndex], row)
											: row[column.dataIndex]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</InfiniteScroll>
		</div>
	);
};

export default App;
