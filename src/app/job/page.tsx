"use client";
import Head from "next/head";
import JobListing from "../component/joblisting";
import { useState } from "react";

export default function JobListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState(""); // Add error handling
  const [activeTab, setActiveTab] = useState("jobs"); // Add activeTab state

  const handleSearch = () => {
    if (!searchQuery || !location) {
      setError("Please enter both a job query and a location.");
      return;
    }
    setError(""); // Clear any previous errors
    setIsLoading(true);

    // Simulate a search function (replace this with real logic)
    setTimeout(() => {
      setIsLoading(false);
      console.log("Searching for:", searchQuery, "in", location);
      // Insert actual search functionality here
    }, 1500);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <main className="min-h-screen flex justify-center items-center flex-col">
        <div className="flex w-1/2 max-w-[800px] space-x-2 pb-10">
          {/* Search Input with Search Icon */}
          <div className="relative flex-grow w-2/3">
            <input
              type="text"
              placeholder="Search for jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} // Add the keydown event listener
              className="flex-grow w-full p-3 pl-12 rounded-l-full border bg-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <img
              src="https://s3-alpha-sig.figma.com/img/6e36/9177/5fcbba1fc3767df2819548b063c70034?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZgxwunoS2f00zUjScsndBW3Sn2iDNSgYwTMRfwgeYwz30d5cuC4vtg-uSCbUZ8ycdnq7c9r0ahseIOyoz~Np2K3syGrPW5TacP415foGtP0EoJFHyIJWh~0L~BnELloxvXJXaW3TR-XW9oYpek-puakQxo~MVIwOWYNvUUqkkb8DAiTFr8oQC9nQmChyYpLT5TYgE39srbpcG~hoZV1XXUkfdxYrFC1BWnMsyLLsAtrFO2xKKeaIbGY3bTx9AWRIS0yl41c-ZzCkcE6HZlVBCCTsgNQVaYmLSa-u7BJooltosS7Wn6GR6W~Cb-fYUDtbo7SvliWphQHfgXIGFF1Xpw__"
              alt="Search Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
            />
          </div>

          {/* Location Input with GPS Icon */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown} // Add the keydown event listener
              className="flex-grow p-3 pl-12 pr-12 rounded-r-full border bg-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <img
              src="https://s3-alpha-sig.figma.com/img/a494/e1f3/1cbedf8ebb26586958590e29810ab238?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XjLYzlZfGX4T~B9ms8EtVVuDHt3agTK5~6xSBn1-V41ljf9Sz6qDXgJUECzWfOoBg9xyukWOcrURmrlZKVXEvsUEgniOiRu8PWpBTMPZkwAerOaZTTG1WIv-BY9DZYILCmhbJhdW1P9fggU1M-l5a0A5-BVsdqFvETjkJkgyB4stzgwl0kQKexEZDqpQmkHGgyFGyDzbgDOuhyfWdLFb3cgos~sksOsJrJk11ylILgnZgXk91sd57Kfg9nVxJxPDOtFbZJsusmw6ehIvBHMUnhuBtMXjuRJDDkiE-VRyOC56zgkEqQBaKzt2ny4foakGFiu3~tXuyTmntHSfQybi5w__"
              alt="GPS Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-500"
            />
          </div>
        </div>

        <div className="w-full border-b-2 border-gray-300">
          {/* Centered Tab Buttons */}
          <div className="flex justify-center mx-auto mt-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("forYou")}
                className={`px-4 py-2 text-center text-sm ${
                  activeTab === "forYou"
                    ? "border-b-4 border-[#AC7575] font-bold text-[16px]"
                    : "text-black-500 text-[16px]"
                }`}
              >
                For You
              </button>
              <button
                onClick={() => setActiveTab("yourActivity")}
                className={`px-4 py-2 text-center text-sm ${
                  activeTab === "yourActivity"
                    ? "border-b-4 border-[#AC7575] font-bold text-[16px]"
                    : "text-black-500 text-[16px]"
                }`}
              >
                Your Activity
              </button>
            </div>
          </div>
        </div>

        {/* Center the JobListing component, with more width and shifted to the right */}
        <div className="w-full max-w-[2500px] pl-20 ml-8 pt-14">
          {/* Added ml-8 for shifting to the right */}
          <JobListing />
        </div>
      </main>
    </div>
  );
}
