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
  size: string;
  type: string;
  sector: string;
  founded: string;
  revenue: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "IT Specialist (IT Technician)",
    logoUrl:
      "https://daihoclienthong.edu.vn/wp-content/uploads/2021/04/LienThongDHKhoaHocTuNhien.jpeg",
    company: "Drodex",
    location: "Rancho Cordova, CA",
    salary: "$45K - $65K",
    address: "2890 Kilgore Road, Rancho Cordova, CA 95670",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    size: "100-500 employees",
    type: "Nonprofit",
    sector: "Healthcare",
    founded: "2003",
    revenue: "$50M - $100M",
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
    size: "10-50 employees",
    type: "Private",
    sector: "Consulting",
    founded: "2010",
    revenue: "$10M - $20M",
  },
  // Add more job data as needed
];

export default function JobListing() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(
    jobs.length > 0 ? jobs[0] : null
  );
  const [showFullDetails, setShowFullDetails] = useState(false);

  const toggleDetails = () => setShowFullDetails(!showFullDetails);

  return (
    <div className="flex items-start min-h-screen">
      <div className="flex w-[90%] space-x-5">
        {/* Left side - Job list */}
        <div className="w-2/5 border-2 rounded-lg">
          <div>
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  setShowFullDetails(false); // Reset when selecting a new job
                }}
                className={`flex w-full items-start border rounded-lg p-4 shadow-sm space-x-4 cursor-pointer hover:bg-gray-100 ${
                  selectedJob?.id === job.id
                    ? "border-black"
                    : "border-transparent"
                } animation-hoverGrow`} // Applying hoverGrow animation
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <img
                      src={job.logoUrl}
                      alt="Company logo"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <h3 className="font-bold text-[20px] text-[#1E1E1E]">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[13px]">{job.address}</p>
                  <p className="text-sm text-[13px]">{job.salary}</p>
                </div>
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
        <div className="flex-grow w-full border-2 border-gray-400 rounded-lg flex-col min-h-[1000px]">
          {selectedJob ? (
            <div className="space-y-4 border-b-2 animation-fadeIn">
              {" "}
              {/* Apply fadeIn animation */}
              {/* Job Information */}
              <div className="space-y-2 pt-8 pb-5 pl-16 pr-10 border-b">
                {/* Top Row - Company Info and Icons */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedJob.logoUrl}
                      alt="Company logo"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div>
                      <p className="text-sm text-black-500 font-semibold">
                        {selectedJob.company}
                      </p>
                    </div>
                  </div>
                  {/* Bookmark and Ellipsis Icons */}
                  <div className="flex space-x-4">
                    {/* Bookmark Icon */}
                    <button
                      aria-label="Bookmark job"
                      className="text-gray-400 hover:text-gray-600 bg-gray-200 p-2 rounded-md"
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
                    {/* Ellipsis Icon */}
                    <button
                      aria-label="More options"
                      className="text-gray-400 hover:text-gray-600 bg-gray-200 p-2 rounded-md"
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
                          d="M6 12h12M6 6h12M6 18h12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Job Description with Show More */}
                <h3 className="font-bold text-[25px] text-[#1E1E1E]">
                  {selectedJob.title}
                </h3>
                <p className="text-[15px] text-black-500">
                  {selectedJob.address}
                </p>
                <p className="text-[16px] text-black-500 pt-10 overflow-hidden transition-all duration-500 ease-in-out">
                  {showFullDetails
                    ? selectedJob.details
                    : selectedJob.details.slice(0, 100) +
                      (selectedJob.details.length > 100 ? "..." : "")}
                </p>
                {selectedJob.details.length > 100 && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={toggleDetails}
                      className="text-[#0B1344] text-[20px] underline mt-2 pt-10 flex items-center"
                    >
                      {showFullDetails ? "Show Less" : "Show More"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 ml-2" // Added ml-2 to add some space between text and icon
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            showFullDetails ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                          } // Change path based on showFullDetails state
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {/* Section: Base Pay */}
              <div className="space-y-3 border-b border-gray-300 pt-3 pl-16 pb-10 pr-10">
                <h4 className="font-bold text-[25px] text-[#1E1E1E]">
                  Base Pay
                </h4>
                <p className="text-sm text-black-500 pb-5">
                  {" "}
                  {selectedJob.address}
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-[30px] text-[#0B1344] flex items-center">
                  <span>{selectedJob.salary}</span>
                  <span className="text-[16px] text-[#0B1344] pl-2 pt-2">
                    /hr
                  </span>
                </div>
              </div>
              {/* Section: Company Overview */}
              <div className="space-y-2 border-b border-gray-300 pl-16 pt-4 pb-10">
                <h4 className="font-bold text-[25px] text-[#1E1E1E]">
                  Company Overview
                </h4>
                <div className="flex-col items-start space-y-2 pt-4">
                  <div className="flex justify-between max-w-[250px] pr-4 text-[16px]">
                    <p className="text-black font-semibold">Size</p>
                    <p className="text-black-500">{selectedJob.size}</p>
                  </div>
                  <div className="flex justify-between max-w-[250px] pr-4 text-[16px]">
                    <p className="text-black font-semibold">Type</p>
                    <p className="text-black-500">{selectedJob.type}</p>
                  </div>
                  <div className="flex justify-between max-w-[250px] pr-4 text-[16px]">
                    <p className="text-black font-semibold">Sector</p>
                    <p className="text-black-500">{selectedJob.sector}</p>
                  </div>
                  <div className="flex justify-between max-w-[250px] pr-4 text-[16px]">
                    <p className="text-black font-semibold">Founded</p>
                    <p className="text-black-500">{selectedJob.founded}</p>
                  </div>
                  <div className="flex justify-between max-w-[250px] pr-4 text-[16px]">
                    <p className="text-black font-semibold">Revenue</p>
                    <p className="text-black-500">{selectedJob.revenue}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Select a job to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}
