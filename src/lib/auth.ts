import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            async authorize(c) {
                if (!c?.email || !c.password) return null;
                const user = await prisma.user.findUnique({
                    where: { email: c.email.trim().toLowerCase() },
                });
                if (!user || !(await bcrypt.compare(c.password, user.password))) return null;
                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        },
    },
};

export const getUserId = async () =>
    (await getServerSession(authOptions))?.user.id;