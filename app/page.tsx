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
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
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
            className="w-full rounded-lg border border-gray-300 bg-black p-3 text-white shadow-sm md:w-56"
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

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
            placeholder="City or State"
            className="w-full rounded-lg border border-gray-300 bg-black p-3 text-white md:w-64"

          />
          
          <input
            type="text"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            placeholder="Search jobs..."
            className="w-full flex-1 rounded-lg border border-gray-300 bg-black p-3 text-white"
          />

          <button
            onClick={searchJobs}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 md:w-auto"
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
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-xl font-bold text-lime-400">
                {job.title}
              </h2>

              <p className="mt-2 text-lg font-semibold text-white">
                {job.company}
              </p>

              <p className="mt-1 text-zinc-300">
                📍 {job.location}
              </p>

              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  {job.source}
                </span>

                {job.remote && (
                  <span className="rounded-full bg-lime-600 px-3 py-1 text-xs font-semibold text-black">
                    Remote
                  </span>
                )}
              </div>

              {job.salary && (
                <p className="mt-2 font-semibold text-lime-400">
                  Salary: {job.salary}
                </p>
              )}

              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-lg bg-lime-500 px-5 py-2 font-semibold text-black transition hover:bg-lime-400"
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
