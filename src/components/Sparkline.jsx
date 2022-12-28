import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Sparkline(props) {
	const { data } = props;
	const chartRef = useRef();
	const upward = data[data.length - 1] - data[0] > 0;

	useEffect(() => {
		if (chartRef?.current) {
			new Chart(chartRef.current, {
				type: "line",
				data: {
					labels: data.map(() => ""),
					datasets: [{ data }],
				},
				options: {
					responsive: false,
					interaction: {
						intersect: false,
					},
					plugins: {
						legend: {
							display: false,
						},
					},
					elements: {
						line: {
							borderColor: upward ? "#e15241" : "#23AF7D",
							backgroundColor: "transparent",
							borderWidth: 1,
						},
						point: {
							radius: 0,
						},
					},
					tooltips: {
						enabled: false,
					},
					scales: {
						x: { display: false },
						y: { display: false },
					},
				},
			});
		}
	}, [data, upward]);

	return (
		<div className="sparkline">
			<canvas
				ref={chartRef}
				width="135"
				height="50"
				style={{
					margin: "auto",
				}}
			/>
		</div>
	);
}

export default Sparkline;
