import NextAuth, { AuthOptions } from "next-auth";
import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import { IStudent } from "@/models/Student";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        await dbConnect();
        try {
          const student: IStudent | null = await Student.findOne({ email: credentials?.email });

          if (!student) {
            throw new Error("No student found with this email.");
          }

          if (student.otp !== credentials?.otp) {
            throw new Error("Incorrect OTP.");
          }

          if (student.otpExpires && student.otpExpires < new Date()) {
            throw new Error("OTP has expired.");
          }

          // Mark as verified if they are signing up
          if (!student.isVerified) {
            student.isVerified = true;
          }
          
          student.otp = undefined;
          student.otpExpires = undefined;
          await student.save();
          
          return {
            id: student._id.toString(), // NextAuth expects 'id'
            email: student.email,
            fullName: student.fullName,
            isVerified: student.isVerified,
            mobile: student.mobile,
          };
        } catch (err: any) {
          throw new Error(err.message || "An error occurred during authorization.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.fullName = user.fullName;
        token.mobile = user.mobile;
      }
      return token; // This token is passed to the session callback
    },
    async session({ session, token }) {
      if (token) {
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
