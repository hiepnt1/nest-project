import { auth } from "@/auth";
import Login from "@/components/auth/login";
// page.tsx use for server-side
const LoginPage = async () => {
    const session = await auth()
    console.log("check session 000: ", session)
    return (
        <Login />
    )
}

export default LoginPage;