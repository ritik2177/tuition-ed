import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

/**
 * Module augmentation for "next-auth" to add custom properties to the session and user objects.
 */
declare module 'next-auth' {
  /**
   * Extends the default Session interface to include custom user properties.
   */
  interface Session {
    user: {
      id: string;
      role: string;
      isVerified: boolean;
      fullName: string;
      mobile?: string;
    } & DefaultSession['user'];
  }

  /**
   * Extends the default User interface.
   */
  interface User extends DefaultUser {
    role: string;
    isVerified: boolean;
    fullName: string;
    mobile?: string;
  }
}

/**
 * Module augmentation for "next-auth/jwt" to add custom properties to the JWT token.
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    isVerified: boolean;
    fullName: string;
    mobile?: string;
  }
}