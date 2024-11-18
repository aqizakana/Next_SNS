import axios from "axios";
import { cookies } from "next/headers";
import type { LoginCredentials, RegisterCredentials, User } from "./types";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	withCredentials: true, // クッキーを有効にする
});

/**
 * 新規登録関数
 * @param data - 登録データ
 */
export const register = async (data: RegisterCredentials): Promise<void> => {
	try {
		await apiClient.post("/api/v1/accounts/register/", data);
	} catch (error) {
		console.error("Registration failed", error);
		throw new Error("Registration failed");
	}
};

/**
 * ログイン関数
 * @param data - ログインデータ
 * @returns ログインユーザー情報
 */
export const login = async (data: LoginCredentials): Promise<User> => {
	try {
		const { data: response } = await apiClient.post(
			"/api/v1/accounts/login/",
			data
		);
		// トークンをサーバーサイドでクッキーに保存
		cookies().set("auth_token", response.token);
		return response.user;
	} catch (error) {
		console.error("Login failed", error);
		throw new Error("Login failed");
	}
};

/**
 * ログアウト関数
 */
export const logout = async (): Promise<void> => {
	try {
		await apiClient.post("/api/v1/accounts/logout/");
		// クッキーをサーバーサイドで削除
		cookies().delete("auth_token");
	} catch (error) {
		console.error("Logout failed", error);
		throw new Error("Logout failed");
	}
};

/**
 * 現在ログイン中のユーザーを取得
 * @returns ユーザー情報または null
 */
export const getCurrentUser = async (): Promise<User | null> => {
	const authToken = cookies().get("auth_token");
	if (!authToken) {
		return null;
	}

	try {
		const { data: user } = await apiClient.get("/api/v1/accounts/me/", {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		return user;
	} catch (error) {
		console.error("Failed to fetch current user", error);
		return null;
	}
};
