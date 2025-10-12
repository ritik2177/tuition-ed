import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Augment the default User model to include our custom fields
   */
  interface User {
    role?: 'student' | 'teacher' | 'admin';
    id?: string;
    isVerified?: boolean;
    fullName?: string;
    email?: string;
    mobile?: string;
  }

  /**
   * Augment the default Session to include the custom user object
   */
  interface Session {
    user: {
      role?: 'student' | 'teacher' | 'admin';
    } & User;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string;
    role?: 'student' | 'teacher' | 'admin';
    isVerified?: boolean;
    fullName?: string;
    email?: string;
    mobile?: string;
  }
}