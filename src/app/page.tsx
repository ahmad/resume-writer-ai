
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Home() {
  return (
      <PublicLayout>
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
      </PublicLayout>
  );
}
