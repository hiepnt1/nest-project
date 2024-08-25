import { signIn } from "@/auth";
import HomePage from "@/components/layout/homepage";

export default function Home() {
  return (
    <div>
      <HomePage />
      <form action={async () => {
        'use server'
        await signIn()
      }}>


        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
