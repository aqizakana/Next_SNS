import axios from "axios";
import type { LoginCredentials, RegisterCredentials, User } from "./types";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const register = async (data: RegisterCredentials): Promise<void> => {
	await apiClient.post("/api/v1/accounts/register/", data);
};

export const login = async (data: LoginCredentials): Promise<User> => {
	const { data: response } = await apiClient.post(
		"/api/v1/accounts/login/",
		data,
	);
	localStorage.setItem("token", response.token);

	return response.user;
};

export const logout = async (): Promise<void> => {
	await apiClient.post("/api/v1/accounts/logout/");
	localStorage.removeItem("token"); // トークンをクリア
};
