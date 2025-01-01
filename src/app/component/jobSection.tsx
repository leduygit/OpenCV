import Image from "next/image";
import React from "react";

export default function JobSearchSection() {
    return (
        <div className="bg-white w-full py-16 mt-5">
        <h2 className="text-center text-lg font-bold mb-8 text-black">
          Find your job with OpenCV
        </h2>

        <div className="flex justify-center space-x-6 max-w-screen-xl mx-auto">
          {/* Repeated job find cards */}
          <div className="flex flex-col items-center px-12">
            <Image
              src="/images/job.png"
              alt="Picture of the author"
              width={50}
              height={50}
              className="object-cover"
            />
            <p className="mt-4 text-[15px] font-[550] text-black">Find and apply jobs</p>
          </div>

          <div className="flex flex-col items-center px-12">
            <Image
              src="/images/job.png"
              alt="Picture of the author"
              width={50}
              height={50}
              className="object-cover"
            />
            <p className="mt-4 text-[15px] font-[550] text-black">Find and apply jobs</p>
          </div>

          <div className="flex flex-col items-center px-12">
          <Image
              src="/images/job.png"
              alt="Picture of the author"
              width={50}
              height={50}
              className="object-cover"
            />
            <p className="mt-4 text-[15px] font-[550] text-black">Find and apply jobs</p>
          </div>

          <div className="flex flex-col items-center px-12">
            <Image
              src="/images/job.png"
              alt="Picture of the author"
              width={50}
              height={50}
              className="object-cover"
            />
            <p className="mt-4 text-[15px] font-[550] text-black">Find and apply jobs</p>
          </div>
        </div>
      </div>
)
}
