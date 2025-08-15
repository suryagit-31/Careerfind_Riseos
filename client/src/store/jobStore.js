import { create } from "zustand";
import axios from "axios";

const initialFilters = {
  skills: [],
  location: "",
  tags: [],
  search: "",
};

export const useJobStore = create((set, get) => ({
  jobs: [],
  loading: false,
  hasMore: true,
  page: 1,
  filters: initialFilters,

  fetchJobs: async (reset = false) => {
    const { page, filters, jobs } = get();
    const currentPage = reset ? 1 : page;

    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (filters.search) params.append("search", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.skills.length > 0)
        params.append("skills", filters.skills.join(","));
      if (filters.tags.length > 0)
        params.append("tags", filters.tags.join(","));

      const response = await axios.get(`/api/jobs?${params}`);
      const { jobs: newJobs, hasMore } = response.data;

      set({
        jobs: reset ? newJobs : [...jobs, ...newJobs],
        hasMore,
        page: currentPage + 1,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      set({ loading: false });
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axios.post("/api/jobs", jobData);
      set((state) => ({
        jobs: [response.data, ...state.jobs],
      }));
    } catch (error) {
      throw error;
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(`/api/jobs/${id}`, jobData);
      set((state) => ({
        jobs: state.jobs.map((job) => (job._id === id ? response.data : job)),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteJob: async (id) => {
    try {
      await axios.delete(`/api/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
      hasMore: true,
    }));
  },

  resetFilters: () => {
    set({
      filters: initialFilters,
      page: 1,
      hasMore: true,
    });
  },
}));
