import { auth } from "@/auth";
import Login from "@/components/auth/login";
// page.tsx use for server-side
const LoginPage = async () => {
    return (
        <Login />
    )
}

export default LoginPage;