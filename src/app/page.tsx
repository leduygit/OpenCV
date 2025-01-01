"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      {/* Welcome Text */}
      <div className="text-center">
        <h1 className="text-[#0B1344] text-center font-sans text-6xl font-bold leading-[86px] tracking-[-1px]">
          Startup Framework
        </h1>
        <div className="mx-8">
          <p className="mt-8 text-[#15143966] text-center font-sans font-bold text-[22px] font-normal h-[96x] w-[582px]">
            We made it so beautiful and simple. It combines landings, pages,
            blogs, and shop screens. It is definitely the tool you need in your
            collection!
          </p>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="mt-24">
        <button
          className="bg-[#AC7575] text-white font-sans font-medium text-[18px] py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
          style={{ width: "300px" }}
          onClick={() => router.push("/recommend")}
        >
          Let's get started
        </button>
      </div>
    </div>
  );
}
