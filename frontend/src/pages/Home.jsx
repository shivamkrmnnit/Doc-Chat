import React from "react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Gradient blobs */}
        <div className="absolute w-[399px] h-[325px] top-[230px] right-[380px] rotate-[47.67deg] opacity-[0.32]">
          <div className="relative h-[325px]">
            <div className="absolute w-[399px] h-[285px] top-0 left-0 rounded-[199.42px/142.27px] blur-[100px] bg-[linear-gradient(180deg,rgba(9,9,9,0)_0%,rgba(111,0,255,1)_100%)]" />
            <div className="absolute w-48 h-[194px] top-[132px] left-[104px] blur-[100px] bg-[linear-gradient(180deg,rgba(24,75,255,0)_0%,rgba(255,255,255,0.69)_100%)]" />
          </div>
        </div>

        <div className="absolute w-[685px] h-[559px] top-[280px] right-[-100px] rotate-[18.50deg] opacity-[0.52]">
          <div className="relative h-[559px]">
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(151,71,255,1)_100%)] absolute w-[685px] h-[489px] top-0 left-0 rounded-[342.5px/244.34px] blur-[100px]" />
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.69)_100%)] absolute w-[329px] h-[333px] top-[226px] left-[178px] blur-[100px]" />
          </div>
        </div>

        <div className="absolute w-[685px] h-[559px] top-[400px] left-[-300px] rotate-[47.67deg] opacity-[0.52]">
          <div className="relative h-[559px]">
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(151,71,255,1)_100%)] absolute w-[685px] h-[489px] top-0 left-0 rounded-[342.5px/244.34px] blur-[100px]" />
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.69)_100%)] absolute w-[329px] h-[333px] top-[226px] left-[178px] blur-[100px]" />
          </div>
        </div>

        {/* <img
          className="absolute w-full h-full object-cover opacity-30"
          alt="Texture"
          src="/texture.png"
        /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <section className="flex-grow flex items-center justify-center px-6 py-20 min-h-screen bg-white">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-snug">
              Welcome to{" "}
              <span className="text-purple-700">LLM Local Search</span> 🔍
            </h1>
            <h2 className="text-lg text-gray-700 mb-3 font-medium">
              Unlock intelligent, local document search powered by LLMs.
            </h2>
            <p className="text-base text-gray-600">
              Upload files, ask questions, and get precise answers — all on your
              device. Private. Fast. AI-powered.
            </p>
          </div>
        </section>

        {/* Requirements / How It Works */}
        <section className="relative z-10 bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-10">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
                <h4 className="text-xl font-semibold mb-2 text-purple-700">
                  1. Upload File
                </h4>
                <p className="text-gray-600">
                  Upload any local file (PDF, DOCX, TXT) securely. We extract
                  and index content for search.
                </p>
              </div>
              {/* Step 2 */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
                <h4 className="text-xl font-semibold mb-2 text-purple-700">
                  2. Ask Questions
                </h4>
                <p className="text-gray-600">
                  Ask any question related to the uploaded document using
                  natural language. We use LLMs to interpret it.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
                <h4 className="text-xl font-semibold mb-2 text-purple-700">
                  3. Get Smart Answers
                </h4>
                <p className="text-gray-600">
                  Instantly get context-aware answers pulled directly from your
                  document content.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
