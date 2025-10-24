"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void; };
  }
}

export default function PayButton({ amount, bookingId }: { amount: number; bookingId: string }) {

  const { data: session } = useSession();

  useEffect(() => {
    // Only add script if not already present
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);


  const handlePay = async () => {
    if (!session?.user) {
      toast.error("You must be logged in to make a payment.");
      return;
    }
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount, bookingId: bookingId }),
    });
    const order = await res.json();

    const options: RazorpayOptions =  {
      key: process.env.NEXT_PUBLIC_RP_KEY_ID ?? "", // only public key here
      amount: order.amount,
      currency: order.currency,
      name: "College Project",
      description: "Payment for Demo",
      order_id: order.id,
      handler: async function (response: RazorpayResponse) {
        toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        await updateBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: session.user.name || "",
        email: session.user.email || "",
        contact: session.user.mobile || "",
      },
      theme: { color: "#8b5cf6" },
    };

    // Wait for Razorpay script to load
    if (typeof window.Razorpay !== "function") {
      toast.error("Razorpay SDK not loaded yet. Please try again in a moment.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

   const updateBooking = async (paymentId: string) => {
    try {
      const updateRes = await fetch(`/api/bookings/${bookingId}`, {  // Ensure this API endpoint exists
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: paymentId }),
      });

      if (!updateRes.ok) {
        console.error("Failed to update booking:", await updateRes.json());
        toast.error("Failed to update booking after payment. Contact support.");
      } else {
        toast.success("Booking confirmed! Thank you!");
      }
    } catch (error: unknown) {
      console.error("Error updating booking:", error);
      toast.error("Error updating booking after payment. Contact support.");
    }
  };




  return (
    <button
      onClick={handlePay}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md"
    >
      Pay ₹{amount}
    </button>
  );
}
