"use client";
import { useState } from "react";
import AccountForm from "../../../components/AccountForm";
import BaseLayout from "../baseLayout";
import style from "./accounts.module.css";
import { login, logout, register } from "./api";
import type { LoginCredentials, RegisterCredentials, User } from "./types";
const AccountsPage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [message, setMessage] = useState<string>("");

	const handleAction = async (
		action: "register" | "login" | "logout",
		data?: RegisterCredentials | LoginCredentials,
	) => {
		try {
			if (action === "register" && data) {
				await register(data as RegisterCredentials);
				setMessage("Registration successful");
			} else if (action === "login" && data) {
				const loggedInUser = await login(data as LoginCredentials);
				setUser(loggedInUser);
				setMessage("Login successful");
			} else if (action === "logout") {
				await logout();
				setUser(null);
				setMessage("Logout successful");
			}
		} catch (error) {
			setMessage(`${action} failed`);
			console.error(`${action} failed`, error);
		}
	};

	return (
		<BaseLayout>
			<div className={style.body}>
				<h1>Account Management</h1>

				{message && <p>{message}</p>}
				{user ? (
					<div>
						<p>Welcome, {user.username}!</p>
						<button type="submit" onClick={() => handleAction("logout")}>
							Logout
						</button>
					</div>
				) : (
					<div className={style.Form}>
						<h2>Register</h2>
						<AccountForm
							onSubmit={(data) => handleAction("register", data)}
							isRegister={true}
						/>
						<h2>Login</h2>
						<AccountForm onSubmit={(data) => handleAction("login", data)} />
					</div>
				)}
			</div>
		</BaseLayout>
	);
};

export default AccountsPage;
