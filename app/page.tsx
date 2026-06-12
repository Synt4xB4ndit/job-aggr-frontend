"use client";

import { useState } from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  source: string;
  apply_url: string;
  salary?: string | null;
  job_type?: string | null;
  remote: boolean;
}

export default function Home() {
  const [keyword, setKeyword] = useState("supervisor");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchJobs() {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs?keyword=${encodeURIComponent(
          keyword
        )}`
      );

      const data = await response.json();

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load jobs.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-cyan-400 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold">
          Job Aggregator
        </h1>

        <div className="mb-8 flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            placeholder="Search jobs..."
            className="flex-1 rounded border bg-black p-3"
          />

          <button
            onClick={searchJobs}
            className="rounded bg-blue-600 px-6 py-3 text-white"
          >
            Search
          </button>
        </div>

        {loading && (
          <p>Loading jobs...</p>
        )}

        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="rounded bg-green-400 p-5 shadow"
            >
              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p>{job.company}</p>

              <p>{job.location}</p>

              <p className="text-sm text-black">
                Source: {job.source}
              </p>

              {job.salary && (
                <p>Salary: {job.salary}</p>
              )}

              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded bg-green-600 px-4 py-2 text-white"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
