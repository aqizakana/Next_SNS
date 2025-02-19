"use client";

import { useState } from "react";
import styles from "./AccountForm.module.css";

interface AccountFormProps {
	onSubmit: (data: {
		username: string;
		password: string;
		email?: string;
	}) => Promise<void>;
	isRegister?: boolean;
}

const AccountForm: React.FC<AccountFormProps> = ({
	onSubmit,
	isRegister = false,
}) => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		email: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const { username, password, email } = formData;
		await onSubmit(
			isRegister ? { username, password, email } : { username, password },
		);
		// If onSubmit is successful, you could trigger a redirect or handle state changes here
		// Normally, you'd use a router.push or similar client-side navigation for redirection
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<input
				name="username"
				type="text"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				required={true}
				className={styles.input}
			/>
			<input
				name="password"
				type="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required={true}
				className={styles.input}
			/>
			{isRegister && (
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required={true}
					className={styles.input}
				/>
			)}
			<button type="submit" className={styles.button}>
				{isRegister ? "Register" : "Login"}
			</button>
		</form>
	);
};

export default AccountForm;
