// pages/job-listing.tsx
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

      <main className="min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Available Jobs</h1>
        <JobListing />
      </main>
    </div>
  );
}
