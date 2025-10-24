/**
 * This file contains global type declarations.
 */

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name:string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string | null;
    email?: string | null;
    contact?: string | null;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

// This export statement is necessary to make this file a module.
export {};