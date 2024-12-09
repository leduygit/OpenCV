"use client";
import Head from "next/head";
import JobListing from "../component/joblisting";
import { useState, useEffect } from "react";
import FilterButton from "../component/FilterButton";
import JobDropdown from "../component/JobDropdown";

export default function JobListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [jobs, setJobs] = useState([]); // State for storing job data

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data.jobs || []); // Assuming API response has a `jobs` field
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error message:", err.message); // Safely access `message`
          setError(err.message);
        } else {
          console.error("Unknown error:", err);
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChoice = (selectedOptions: string[]) => {
    console.log(`Selected filters:`, selectedOptions);
  };

  const handleSearch = () => {
    if (!searchQuery || !location) {
      setError("Please enter both a job query and a location.");
      return;
    }
    setError(""); // Clear any previous errors
    console.log("Searching for:", searchQuery, "in", location);
    // Add search filtering logic here if needed
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <main className="min-h-screen flex items-center flex-col">
        <div className="flex w-1/2 max-w-[800px] space-x-2 pb-10">
          <div className="relative flex-grow w-2/3">
            <input
              type="text"
              placeholder="Search for jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow w-full p-3 pl-12 rounded-l-full border bg-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow p-3 pl-12 pr-12 rounded-r-full border bg-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>

        <div className="w-full border-b-2 border-gray-300">
          <div className="flex justify-center mx-auto mt-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("forYou")}
                className={`px-4 py-2 text-center text-[17px] relative ${
                  activeTab === "forYou"
                    ? "font-bold text-[17px]"
                    : "text-black-500 text-[17px]"
                }`}
              >
                For You
                <span
                  className={`absolute left-0 bottom-0 h-[4px] w-full bg-[#AC7575] transform transition-all duration-300 ease-in-out ${
                    activeTab === "forYou" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
              <button
                onClick={() => setActiveTab("yourActivity")}
                className={`px-4 py-2 text-center text-[17px] relative ${
                  activeTab === "yourActivity"
                    ? "font-bold text-[17px]"
                    : "text-black-500 text-[17px]"
                }`}
              >
                Your Activity
                <span
                  className={`absolute left-0 bottom-0 h-[4px] w-full bg-[#AC7575] transform transition-all duration-300 ease-in-out ${
                    activeTab === "yourActivity" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full ml-48 mt-5">
          <FilterButton
            label="Company Rating"
            options={["Option 1", "Option 2", "Option 3", "Option 4"]}
            onFind={handleFilterChoice}
          />
        </div>

        {isLoading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activeTab === "forYou" ? (
          <div className="w-full max-w-[2500px] pl-20 ml-8 pt-14">
            <JobListing jobs={jobs} />
          </div>
        ) : (
          <div className="w-full max-w-[2500px] pt-14">
            <JobDropdown title="Recently Visited">
              <JobListing jobs={jobs} />
            </JobDropdown>
            <JobDropdown title="Saved">
              <JobListing jobs={jobs} />
            </JobDropdown>
          </div>
        )}
      </main>
    </div>
  );
}
