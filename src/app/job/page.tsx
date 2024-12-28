"use client";
import Head from "next/head";
import { JobListing } from "../component/joblisting";
import { useState, useEffect } from "react";
import FilterButton from "../component/FilterButton";
import JobDropdown from "../component/JobDropdown";
import { Job } from "../component/joblisting";
import { useSearchParams } from "next/navigation";

interface InteractionResponse {
  interactions: {
    jobId: Job; // The jobId is an object of type Job
  }[];
}

export default function JobListingPage() {
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [viewedJobs, setViewedJobs] = useState<Job[]>([]);

  // Check if the 'jobs' query parameter exists

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/user/interaction?interactionType=saved",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the bearer token
            },
          }
        );

        const data: InteractionResponse = await response.json();
        const jobArray: Job[] = data.interactions.map((data) => data.jobId);
        setSavedJobs(jobArray);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchViewedJobs = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/user/interaction?interactionType=viewed",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the bearer token
            },
          }
        );
        const data: InteractionResponse = await response.json();
        const jobArray: Job[] = data.interactions.map((data) => data.jobId);
        setViewedJobs(jobArray);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const jobsParam = localStorage.getItem("jobs");

    if (jobsParam) {
      try {
        // Parse and set the jobs from localStorage
        const jobsArray: Job[] = JSON.parse(jobsParam);
        setJobs(jobsArray); // Set the jobs passed in localStorage
      } catch (err) {
        console.error("Error parsing jobs parameter", err);
      }
    } else if (activeTab === "forYou" && jobs.length === 0) {
      // Fetch jobs only if not passed via localStorage and if jobs are not already loaded
      fetchJobs();
    }

    if (activeTab === "yourActivity") {
      fetchSavedJobs();
      fetchViewedJobs();
    }

    // This function will be triggered when the page is refreshed or the user navigates away
    const handleBeforeUnload = () => {
      // Optionally remove jobs only if you want them cleared when the page is leaving
      localStorage.removeItem("jobs");
    };

    // Adding the event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeTab, jobs.length, params]);

  const handleFilterChoice = (selectedOptions: string[]) => {
    console.log(`Selected filters:`, selectedOptions);
  };

  const handleSearch = () => {
    if (!searchQuery || !location) {
      setError("Please enter both a job query and a location.");
      return;
    }
    setError("");
    console.log("Searching for:", searchQuery, "in", location);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <Head>
        <title>Job Listings</title>
      </Head>
      <main className="min-h-screen flex items-center flex-col">
        {/* Search Section */}
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

        {/* Tab Section */}
        <div className="w-full border-b-2 border-gray-300">
          <div className="flex justify-center mx-auto mt-8">
            <div className="flex space-x-4">
              {["forYou", "yourActivity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-center text-[17px] relative ${
                    activeTab === tab
                      ? "font-bold text-[17px]"
                      : "text-black-500 text-[17px]"
                  }`}
                >
                  {tab === "forYou" ? "For You" : "Your Activity"}
                  <span
                    className={`absolute left-0 bottom-0 h-[4px] w-full bg-[#AC7575] transform transition-all duration-300 ease-in-out ${
                      activeTab === tab ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex w-full ml-48 mt-5">
          <FilterButton
            label="Company Rating"
            options={["Option 1", "Option 2", "Option 3", "Option 4"]}
            onFind={handleFilterChoice}
          />
        </div>

        {/* Job Listings Section */}
        {isLoading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activeTab === "forYou" ? (
          <div className="w-full max-w-[2500px] pl-20 ml-8 pt-14">
            {jobs.length > 0 ? (
              <JobListing jobs={jobs} />
            ) : (
              <p>No jobs available.</p>
            )}
          </div>
        ) : (
          <div className="w-full max-w-[2500px] pt-14">
            <JobDropdown title="Recently Visited">
              {viewedJobs.length > 0 ? (
                <JobListing jobs={viewedJobs} />
              ) : (
                <p>No recently visited jobs.</p>
              )}
            </JobDropdown>
            <JobDropdown title="Saved">
              {savedJobs.length > 0 ? (
                <JobListing jobs={savedJobs} />
              ) : (
                <p>No saved jobs.</p>
              )}
            </JobDropdown>
          </div>
        )}
      </main>
    </div>
  );
}
