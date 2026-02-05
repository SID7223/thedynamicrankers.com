import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

interface Job {
  id: number;
  title: string;
  location: string;
  description: string;
}

const Careers: React.FC = () => {
  const [filter, setFilter] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobListings: Job[] = [
    {
      id: 1,
      title: "Frontend Developer",
      location: "Remote",
      description: "Develop and maintain user interfaces.",
    },
    {
      id: 2,
      title: "Backend Developer",
      location: "On-site",
      description: "Build and manage server-side logic.",
    },
    {
      id: 3,
      title: "UX Designer",
      location: "Remote",
      description: "Create intuitive and user-friendly designs.",
    },
  ];

  const filteredJobs = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase())
  );

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  return (
    <>
      <Helmet>
        <title>Careers - Your Website Name</title>
        <meta name="description" content="View open positions and apply." />
        <meta property="og:title" content="Careers - Your Website Name" />
        <meta property="og:description" content="View open positions and apply." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          <div className="max-w-4xl mx-auto p-8">
            <motion.h1
              className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Careers
            </motion.h1>

            {/* Search Filter */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by title or location..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-between items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {job.location}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {job.description}
                    </p>
                  </div>

                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => handleApplyClick(job)}
                  >
                    Apply Now
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Application Form */}
            {showForm && selectedJob && (
              <motion.div
                className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Apply for {selectedJob.title}
                </h2>

                <form
                  name="careers"
                  method="POST"
                  action="/api/contact"
                  className="space-y-4"
                >
                  <input type="hidden" name="redirect" value="/thank-you" />
                  <input
                    type="hidden"
                    name="jobTitle"
                    value={selectedJob.title}
                  />

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resumeLink"
                      className="block text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Resume Link
                    </label>
                    <input
                      type="url"
                      id="resumeLink"
                      name="resumeLink"
                      placeholder="https://..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Cover Letter
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Submit Application
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Careers;
