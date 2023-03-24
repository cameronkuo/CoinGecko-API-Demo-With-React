import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const tdClasses = ["p-2", "text-center", "whitespace-nowrap"];

const App = (props) => {
	const { defaultSortBy, onSort } = props;
	const [sortBy, setSortBy] = useState(`${defaultSortBy}` ?? "");

	useEffect(() => {
		if (sortBy !== defaultSortBy) onSort(sortBy);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortBy]);

	return (
		<div className="w-full overflow-x-auto">
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
				<table className="w-full">
					<thead>
						<tr>
							{props.columns.map((column) => (
								<th
									key={column.dataIndex}
									className={["sticky", "top-0", "bg-dark"]
										.concat(tdClasses)
										.concat(
											column.className?.includes("sticky") ? ["!z-[99]"] : []
										)
										.concat(column.className)
										.concat(column.sortBy ? "cursor-pointer" : [])
										.concat()
										.join(" ")}
									onClick={() => {
										if (column.sortBy) {
											if (sortBy === column.sortBy.desc)
												setSortBy(column.sortBy.asc);
											else if (sortBy === column.sortBy.asc) setSortBy("");
											else setSortBy(column.sortBy.desc);
										}
									}}
									style={{
										width: column.width,
									}}
								>
									{column.title}&nbsp;
									{column.sortBy?.desc === sortBy ? <CaretDownFilled /> : null}
									{column.sortBy?.asc === sortBy ? <CaretUpFilled /> : null}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{props.dataSource.map((row) => (
							<tr key={row.id} className="group">
								{props.columns.map((column) => (
									<td
										key={column.dataIndex}
										className={[
											"group-hover:bg-[#1e2332]",
											"border-solid",
											"border-t",
											"border-gray-500",
										]
											.concat(tdClasses)
											.concat(column.className)
											.join(" ")}
										style={{
											width: column.width,
										}}
									>
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
