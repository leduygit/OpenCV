import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  logoUrl: string;
  location: string;
  salary: string;
  details: string;
  address: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "IT Specialist (IT Technician)",
    logoUrl: "https://via.placeholder.com/150",
    company: "Drodex",
    location: "Rancho Cordova, CA",
    salary: "$45K - $65K",
    address: "2890 Kilgore Road, Rancho Cordova, CA 95670",
    details:
      "Overview: ASPR is a public health preparedness and emergency response organization...",
  },
  {
    id: 2,
    title: "IT Associate",
    logoUrl: "https://via.placeholder.com/150",
    company: "Nexus HR Services",
    location: "Sacramento, CA",
    salary: "$25.00 Per Hour",
    address: "2890 Kilgore Road, Rancho Cordova, CA 95670",
    details: "Provide IT support to ensure efficient operations...",
  },
  // Add more job data as needed
];

export default function JobListing() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="flex items-start min-h-screen">
      {/* Centered content container with adjusted width */}
      <div className="flex w-[90%] space-x-5">
        {/* Left side - Job list */}
        <div className="w-2/5 border-2 rounded-lg">
          <div>
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)} // Set selected job on click
                className={`flex w-full items-start border rounded-lg p-4 shadow-sm space-x-4 cursor-pointer hover:bg-gray-100 space-y-1 ${
                  selectedJob?.id === job.id
                    ? "border-black"
                    : "border-transparent"
                }`} // Conditional border class
              >
                {/* Company logo */}
                <img
                  src={job.logoUrl}
                  alt="Company logo"
                  className="w-8 h-8 object-cover rounded-full"
                />

                {/* Job details */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <h3 className="font-bold text-[20px] text-[#1E1E1E]">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[13px]">{job.address}</p>
                  <p className="text-sm text-[13px]">{job.salary}</p>
                </div>

                {/* Bookmark icon */}
                <div>
                  <button
                    aria-label="Save job"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v18l7-5 7 5V3z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Job details */}
        <div className="w-full p-4 border-2 rounded-lg">
          {selectedJob ? (
            <div>
              <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
              <p className="text-lg text-gray-700">{selectedJob.company}</p>
              <p>{selectedJob.location}</p>
              <p className="text-green-500">{selectedJob.salary}</p>
              <p className="mt-4">{selectedJob.details}</p>
            </div>
          ) : (
            <p>Select a job to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}
