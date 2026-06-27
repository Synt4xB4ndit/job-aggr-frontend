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

  const [selectedSource, setSelectedSource] =
    useState("All");

  const [locationFilter, setLocationFilter] =
  useState("");

  async function searchJobs() {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs?keyword=${encodeURIComponent(
          keyword
        )}&location=${encodeURIComponent(locationFilter)}`
      );

      const data = await response.json();

      setJobs(data.jobs || []);
      console.log(data.jobs);
    } catch (error) {
      console.error(error);
      alert("Failed to load jobs.");
    }

    setLoading(false);
  }

  const filteredJobs = jobs.filter((job) => {
    const sourceMatch =
      selectedSource === "All" ||
      job.source === selectedSource;

    const locationMatch =
      locationFilter.trim() === "" ||
      job.location
        .toLowerCase()
        .includes(
          locationFilter.toLowerCase()
        );

    return sourceMatch && locationMatch;
  });

  return (
    <main className="min-h-screen bg-cyan-400 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold">
          Job Aggregator
        </h1>

        <div className="mb-6">
          <select
            value={selectedSource}
            onChange={(e) =>
              setSelectedSource(e.target.value)
            }
            className="rounded border bg-black p-3 text-white"
          >
            <option value="All">
              All Sources
            </option>

            <option value="The Muse">
              The Muse
            </option>

            <option value="Jooble">
              Jooble
            </option>

            <option value="Adzuna">
              Adzuna
            </option>

            <option value="USAJobs">
              USAJobs
            </option>
          </select>
        </div>

        <div className="mb-8 flex gap-3">
          <input
            type="text"
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
            placeholder="Location..."
            className="rounded border bg-black p-3 text-white"

          />
          
          <input
            type="text"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            placeholder="Search jobs..."
            className="flex-1 rounded border bg-black p-3 text-white"
          />

          <button
            onClick={searchJobs}
            className="rounded bg-blue-600 px-6 py-3 text-white"
          >
            Search
          </button>
        </div>

        <p className="mb-4 text-lg font-semibold">
          {filteredJobs.length} jobs found
        </p>

        {loading && (
          <p className="mb-4">
            Loading jobs...
          </p>
        )}

        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <div
              key={index}
              className="rounded bg-green-400 p-5 shadow"
            >
              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="font-medium">
                {job.company}
              </p>

              <p>
                📍 {job.location}
              </p>

              <div className="mt-2 flex gap-2">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  {job.source}
                </span>

                {job.remote && (
                  <span className="rounded bg-green-200 px-2 py-1 text-xs">
                    Remote
                  </span>
                )}
              </div>

              {job.salary && (
                <p className="mt-2">
                  Salary: {job.salary}
                </p>
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
