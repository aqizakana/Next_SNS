"use client";

import { useState } from "react";

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
		<form onSubmit={handleSubmit}>
			<input
				name="username"
				type="text"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				required={true}
			/>
			<input
				name="password"
				type="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required={true}
			/>
			{isRegister && (
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required={true}
				/>
			)}
			<button type="submit">{isRegister ? "Register" : "Login"}</button>
		</form>
	);
};

export default AccountForm;
