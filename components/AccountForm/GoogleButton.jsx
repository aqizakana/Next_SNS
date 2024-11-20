import axios from "axios";
import { redirect } from "next/navigation";
import { signIn } from "../../src/app/auth";
//google/

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignIn() {
	const googleIn = async () => {
		"use server";
		await signIn("google").then(() => redirect("/three"));
		//サインインで得られたユーザー情報をサーバーに送
		console.log(signIn("google"));
	};

	return (
		<form action={googleIn}>
			<button type="submit">Signin with Google</button>
		</form>
	);
}
