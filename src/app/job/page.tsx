"use client";
import Head from "next/head";
import JobListing from "../component/joblisting";

export default function JobListingPage() {
  return (
    <div>
      <Head>
        <title>Job Listing</title>
        <meta name="description" content="A job listing page" />
      </Head>

      <main className="min-h-screen p-4 flex justify-center items-center">
        {/* Center the JobListing component, with more width and shifted to the right */}
        <div className="w-full max-w-[2500px] p-4 ml-8">
          {" "}
          {/* Added ml-8 for shifting to the right */}
          <h1 className="text-3xl font-bold mb-4 text-center">
            Available Jobs
          </h1>
          <JobListing />
        </div>
      </main>
    </div>
  );
}
