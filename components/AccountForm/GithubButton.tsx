
import { redirect } from "next/navigation"
import { signIn } from "../../src/app/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github").then(() => redirect("/htree"));

      }}
    >
      <button type="submit">Signin with GitHub</button>
    </form>
  )
} 