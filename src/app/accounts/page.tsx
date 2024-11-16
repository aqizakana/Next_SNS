"use client";

import { redirect } from "next/navigation";
import type React from "react";
import { useState } from "react";
import BaseLayout from "../baseLayout";
import AccountForm from "./AccountForm";
import style from "./accounts.module.css";
import { login, logout, register } from "./api";
import type { LoginCredentials, RegisterCredentials, User } from "./types";
const AccountsPage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [message, setMessage] = useState<string>("");

	const handleRegister = async (data: RegisterCredentials) => {
		try {
			await register(data);
			setMessage("Registration successful");
		} catch (error) {
			setMessage("Registration failed");
			console.error("Registration failed", error);
		}
	};

	const handleLogin = async (data: LoginCredentials) => {
		try {
			const loggedInUser = await login(data);
			setUser(loggedInUser);
			setMessage("Login successful");
			/*  redirect('/three'); */
		} catch (error) {
			setMessage("Login failed");
			console.error("Login failed", error);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			setUser(null);
			setMessage("Logout successful");
		} catch (error) {
			setMessage("Logout failed");
			console.error("Logout failed", error);
		}
	};

	return (
		<BaseLayout>
			<div className={style.body}>
				<h1>Account Management</h1>
				{message && <p>{message}</p>}
				{!user ? (
					<>
						<div className={style.Form}>
							<h2>Register</h2>
							<AccountForm onSubmit={handleRegister} isRegister={true} />
							<h2>Login</h2>
							<AccountForm onSubmit={handleLogin} />
						</div>
					</>
				) : (
					<div>
						<p>Welcome, {user.username}!</p>
						<button type="submit" onClick={handleLogout}>
							Logout
						</button>
					</div>
				)}
			</div>
		</BaseLayout>
	);
};

export default AccountsPage;
