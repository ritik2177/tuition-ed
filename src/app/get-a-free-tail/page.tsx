"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUI } from "@/provider/UIProvider";

const steps = ["Academic Details", "Schedule Demo"];

export default function FreeTrialPage() {
  const { data: session, status } = useSession();
  const { openModal } = useUI();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        studentName: session.user.fullName || "",
        email: session.user.email || "",
        mobile: session.user.mobile || "",
      }));
    }
  }, [session]);

  const handleNext = () => {
    setError("");
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleReset = () => {
    setActiveStep(0);
    setFormData({});
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/demoClass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      handleNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-4 mt-4">
            <input
              name="grade"
              type="text"
              placeholder="Grade / Class"
              required
              value={formData.grade || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject / Course
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Maths",
                  "Science",
                  "English",
                  "Physics",
                  "Chemistry",
                  "Biology",
                  "History",
                  "Coding",
                  "Other",
                ].map((subject) => (
                  <label key={subject} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="subject"
                      value={subject.toLowerCase()}
                      checked={formData.subject === subject.toLowerCase()}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.subject === "other" && (
              <input
                name="otherSubject"
                type="text"
                placeholder="Please specify subject"
                value={formData.otherSubject || ""}
                onChange={handleChange}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <input
              name="demoTopic"
              type="text"
              placeholder="Specific Demo Topic (Optional)"
              value={formData.demoTopic || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-4 mt-4">
            <input
              name="parentName"
              type="text"
              placeholder="Parent's Name"
              required
              value={formData.parentName || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="city"
              type="text"
              placeholder="City"
              required
              value={formData.city || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="country"
              type="text"
              placeholder="Country"
              required
              value={formData.country || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="demoTime"
              type="datetime-local"
              required
              value={formData.demoTime || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              name="comment"
              rows={4}
              placeholder="Additional Comments"
              value={formData.comment || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="mt-10 min-h-screen flex items-center justify-center p-6 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch rounded-2xl border border-gray-200  shadow-xl overflow-hidden">
          {/* Left side */}
          <div className="hidden lg:flex flex-col justify-center items-center text-center p-10 ">
            <h1 className="text-3xl font-bold mb-3">Unlock Your Potential</h1>
            <p className="max-w-md">
              Experience our interactive teaching methods firsthand. Our free demo class helps
              you understand our curriculum, meet expert tutors, and see how we make learning
              engaging and effective.
            </p>
          </div>

          {/* Right side */}
          <div className="p-6 sm:p-10 md:p-12">
            <h2 className="text-2xl font-semibold text-center ">
              Book Your Free Demo Class
            </h2>

            {/* Stepper */}
            <div className="flex justify-center mt-6 mb-8">
              <div className="flex space-x-8">
                {steps.map((label, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
                        ${index <= activeStep ? "border-purple-600 bg-purple-600 text-white" : "border-gray-300 text-gray-400"}`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-sm mt-2 ${
                        index <= activeStep ? "text-purple-600" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success */}
            {activeStep === steps.length ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">🎉 Demo Class Confirmed!</h3>
                <p className="text-gray-700 mb-1">
                  Your demo class for{" "}
                  <strong>{new Date(formData.demoTime).toLocaleString()}</strong> has been booked.
                </p>
                <p className="text-gray-500 mb-4">
                  A confirmation email has been sent to <strong>{formData.email}</strong>.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Book Another Demo
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : status === "unauthenticated" ? (
              <div className="text-center mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-lg font-medium mb-3 text-gray-700">
                  Please log in to book a demo class.
                </p>
                <button
                  onClick={() => openModal('login')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Login
                </button>
              </div>
            ) : status === "authenticated" && session.user.role !== 'student' ? (
              <div className="text-center mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-lg font-medium mb-3 text-gray-700">
                  Only students can book a free demo class.
                </p>
                <p className="text-sm text-gray-500">
                  Please log in with a student account to proceed.
                </p>
              </div>
            ) : (
              <>
                {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                {renderStep(activeStep)}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    className={`px-4 py-2 rounded-lg border transition ${
                      activeStep === 0
                        ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Back
                  </button>

                  <button
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    {loading
                      ? "Submitting..."
                      : activeStep === steps.length - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
