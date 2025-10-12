import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as NextAuthUser } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { IUser } from "@/models/User";
import { NextResponse } from "next/server";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials: Record<string, string> | undefined): Promise<NextAuthUser | null> {
        await dbConnect();
        try {
          const user: IUser | null = await User.findOne({
            email: credentials?.email,
          });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          // If a requiredRole is passed, check if the user has that role
          if (credentials?.requiredRole && user.role !== credentials.requiredRole) {
            throw new Error(`This login is for ${credentials.requiredRole}s only.`);
          }

          if (user.otp !== credentials?.otp) {
            throw new Error("Incorrect OTP.");
          }

          if (user.otpExpires && user.otpExpires < new Date()) {
            throw new Error("OTP has expired.");
          }

          // Mark as verified if they are signing up
          if (!user.isVerified) {
            user.isVerified = true;
          }

          user.otp = undefined;
          user.otpExpires = undefined;
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            isVerified: user.isVerified,
            mobile: user.mobile,
            role: user.role,
          };
        } catch (err: any) {
          throw new Error(
            err.message || "An error occurred during authorization."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: NextAuthUser | undefined }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.fullName = user.fullName;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as 'student' | 'teacher' | 'admin';
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.fullName = token.fullName;
        session.user.mobile = token.mobile;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect to home page for sign-in
  },
  session: { 
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
