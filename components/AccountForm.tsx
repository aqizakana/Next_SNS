import { redirect } from "next/navigation";
import { useState } from "react";

interface AccountFormProps {
	onSubmit: (data: {
		username: string;
		password: string;
		email?: string;
	}) => void;
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
		redirect("/three");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const { username, password, email } = formData;
		onSubmit(
			isRegister ? { username, password, email } : { username, password },
		);
		redirect("/three");
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
