import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  details: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "IT Specialist (IT Technician)",
    company: "Drodex",
    location: "Rancho Cordova, CA",
    salary: "$45K - $65K",
    details:
      "Overview: ASPR is a public health preparedness and emergency response organization...",
  },
  {
    id: 2,
    title: "IT Associate",
    company: "Nexus HR Services",
    location: "Sacramento, CA",
    salary: "$25.00 - $29.00 Per Hour",
    details: "Provide IT support to ensure efficient operations...",
  },
  // Add more job data as needed
];

export default function JobListing() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="flex">
      {/* Left side - Job list */}
      <div className="w-1/3 border-r p-4">
        {jobs.map((job) => (
          <button
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="block w-full text-left p-2 border-b"
          >
            <h3 className="font-bold">{job.title}</h3>
            <p>{job.company}</p>
            <p className="text-sm text-gray-600">{job.location}</p>
            <p className="text-sm text-green-500">{job.salary}</p>
          </button>
        ))}
      </div>

      {/* Right side - Job details */}
      <div className="w-2/3 p-4">
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
  );
}
