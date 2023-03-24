import { notification } from "antd";
import axios from "axios";

// create an axios instance
const service = axios.create({
	baseURL: process.env.REACT_APP_API_BASE, // api 的 base_url
});

// request interceptor
service.interceptors.request.use(
	(config) => config,
	(error) => {
		notification.error({
			message: `API ERROR`,
			description:
				error.response?.data?.message || error.message || error.toString(),
		});
		console.log({ error }); // for debug
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	(response) => response.data,
	(error) => {
		notification.error({
			message: `API ERROR`,
			description:
				error.response?.data?.error || error.message || error.toString(),
		});
		console.log({ error }); // for debug
		return Promise.reject(error);
	}
);

export default service;
