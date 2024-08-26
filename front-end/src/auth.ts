import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { sendRequest } from "./utils/api";
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        credentials({
            credentials: {
                username: {},
                password: {}
            },
            //send request from server
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/log-in`,
                    body: {
                        username: credentials.username,
                        password: credentials.password
                    }
                })

                if (res.statusCode === 201) {
                    return {
                        _id: res?.data?.user?._id,
                        name: res?.data?.user?.name,
                        email: res?.data?.user?.email,
                        access_token: res?.data?.access_token
                    }
                }
                else if (+res.statusCode === 401) {
                    // password is wrong
                    throw new InvalidEmailPasswordError()
                }
                else if (+res.statusCode === 400) {
                    // account not active
                    throw new InactiveAccountError()
                } else {
                    throw new Error("Internal server error")
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        jwt({ token, user }) {
            // get user from credential of providers
            if (user) {
                // user is available during sign-in
                // defference to types/next-auth.d.ts next-auth/jwt
                token.user = (user as IUser)
            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user

            return session;
        }
    }
})