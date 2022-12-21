import { createBrowserRouter } from "react-router-dom";
import App from "App";
import Home from "pages/Home";
import ErrorPage from "pages/404";
export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "",
				element: <Home />,
			},
			{
				path: "404",
				element: <ErrorPage />,
			},
		],
	},
]);
