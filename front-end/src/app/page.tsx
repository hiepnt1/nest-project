import { auth, signIn } from "@/auth";
import HomePage from "@/components/layout/homepage";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <HomePage />

      <div>{JSON.stringify(session)}</div>
      {/*       
      <form action={async () => {
        'use server'
        await signIn()
      }}>


        <button type="submit">Sign In</button>
      </form> */}
    </div>
  );
}
