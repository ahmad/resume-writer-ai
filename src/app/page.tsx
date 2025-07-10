"use client";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserProfile } from "@/components/auth/UserProfile";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header with User Profile */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">ResumeOracle</h1>
            </div>
            <UserProfile />
          </div>
        </div>

        {/* Landing Page Content */}
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to ResumeOracle
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your AI-powered resume and cover letter assistant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/builder"
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition text-lg"
              >
                Start with AI Builder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
