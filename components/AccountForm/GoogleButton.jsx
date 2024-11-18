
import { redirect } from "next/navigation"
import { signIn } from "../../src/app/auth"

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google").then(() => redirect("/htree"));
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
} 