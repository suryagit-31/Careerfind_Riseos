import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useJobStore } from "../store/jobStore";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";

const JobFeed = () => {
  const { jobs, loading, hasMore, fetchJobs, deleteJob, filters } =
    useJobStore();

  useEffect(() => {
    fetchJobs(true);
  }, [filters]);

  const handleLoadMore = () => {
    if (!loading) {
      fetchJobs();
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <JobFilters />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Job Feed
            </h1>
            <p className="text-neutral-600">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {jobs.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 text-lg mb-2">No jobs found</div>
              <p className="text-neutral-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={jobs.length}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              }
              endMessage={
                jobs.length > 0 && (
                  <div className="text-center py-6 text-neutral-500">
                    You've reached the end of the job listings
                  </div>
                )
              }
            >
              {/* Changed from space-y-6 to responsive grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} onDelete={handleDeleteJob} />
                ))}
              </div>
            </InfiniteScroll>
          )}

          {loading && jobs.length === 0 && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-neutral-200 rounded-full w-16"></div>
                    <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
                    <div className="h-6 bg-neutral-200 rounded-full w-14"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFeed;
