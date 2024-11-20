import { redirect } from "next/navigation";
import { signIn } from "../../src/app/auth";

export default function SignIn() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("github").then(() => redirect("/three"));
			}}
		>
			<button type="submit">Signin with GitHub</button>
		</form>
	);
}

/* try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/accounts/login/`,
      data,
      { withCredentials: true }
    );
    cookies().set("auth_token", response.data.token); // クッキーにトークンを保存
    return response.data.user;
  } catch (error) {
    throw new Error("Login failed");
  } */
