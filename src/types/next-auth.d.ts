import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Augment the default User model to include our custom fields
   */
  interface User {
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
    user: User;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string;
    isVerified?: boolean;
    fullName?: string;
    email?: string;
    mobile?: string;
  }
}