import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { connectDB } from "./db";
import User from "@/app/models/User";
import { log } from "./logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials: any) {
        try {
          await connectDB();

          log.auth("attempt", "unknown", { email: credentials.email });

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            log.auth("failure", "unknown", {
              email: credentials.email,
              reason: "User not found",
            });
            throw new Error("User not found");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isMatch) {
            log.auth("failure", user._id.toString(), {
              email: credentials.email,
              reason: "Invalid password",
            });
            throw new Error("Invalid password");
          }

          log.auth("success", user._id.toString(), {
            email: credentials.email,
          });

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          log.error("Authentication error", error, {
            email: credentials?.email,
          });
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed",
          );
        }
      },
    }),
  ],

  session: { strategy: "jwt" as const },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
