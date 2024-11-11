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
      "Overview: ASPR is a public health preparedness and emergency response organization...",
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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="flex items-start min-h-screen">
      <div className="flex w-[90%] space-x-5">
        {/* Left side - Job list */}
        <div className="w-2/5 border-2 rounded-lg">
          <div>
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`flex w-full items-start border rounded-lg p-4 shadow-sm space-x-4 cursor-pointer hover:bg-gray-100 ${
                  selectedJob?.id === job.id
                    ? "border-black"
                    : "border-transparent"
                }`}
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
        <div className="w-full border-2 rounded-lg flex-col h-[1000px]">
          {selectedJob ? (
            <div className="space-y-4 border-b-2">
              {/* Job Information */}
              <div className="space-y-2 pt-4 pb-4 pl-10 pr-10 border-b">
                {/* Top Row - Company Info and Icons */}
                <div className="flex justify-between items-center">
                  {/* Job Information */}
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
                    {/* Ellipsis Icon */}
                    <button
                      aria-label="More options"
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
                          d="M6 12h12M6 6h12M6 18h12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Job Description */}
                <h3 className="font-bold text-[25px] text-[#1E1E1E]">
                  {selectedJob.title}
                </h3>
                <p className="text-[15px] text-black-500">
                  {selectedJob.address}
                </p>
                <p className="text-[16px] text-black-500 pt-10">
                  {selectedJob.details}
                </p>
              </div>

              {/* Section: Base Pay */}
              <div className="space-y-3 border-b border-gray-300 pt-3 pl-10 pb-4 pr-10">
                <h4 className="font-bold text-[25px] text-[#1E1E1E]">
                  Base Pay
                </h4>
                <p className="text-sm text-black-500"> {selectedJob.address}</p>
                <p className="bg-gray-100 p-4 rounded-lg text-[30px] text-[#0B1344]">
                  {selectedJob.salary}
                </p>
              </div>

              {/* Section: Company Overview */}
              <div className="space-y-2 border-b border-gray-300 pl-10 pt-4 pb-4">
                <h4 className="font-bold text-[25px] text-[#1E1E1E]">
                  Company Overview
                </h4>
                <div className="flex-col items-center space-y-2 pt-4">
                  <p className="text-black-500 text-[16px]">
                    <strong>Size:</strong> {selectedJob.size}
                  </p>
                  <p className="text-black-500 text-[16px]">
                    <strong>Type:</strong> {selectedJob.type}
                  </p>
                  <p className="text-black-500 text-[16px]">
                    <strong>Sector:</strong> {selectedJob.sector}
                  </p>
                  <p className="text-black-500 text-[16px]">
                    <strong>Founded:</strong> {selectedJob.founded}
                  </p>
                  <p className="text-black-500 text-[16px]">
                    <strong>Revenue:</strong> {selectedJob.revenue}
                  </p>
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
