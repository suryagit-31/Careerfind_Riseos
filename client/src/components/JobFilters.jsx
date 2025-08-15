import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { useJobStore } from "../store/jobStore";

const JobFilters = () => {
  const { filters, setFilters, resetFilters, fetchJobs } = useJobStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setFilters({ search });

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchJobs(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    fetchJobs(true);
    setIsExpanded(false);
  };

  const handleResetFilters = () => {
    const resetData = {
      skills: [],
      location: "",
      tags: [],
      search: "",
    };
    setTempFilters(resetData);
    resetFilters();
    fetchJobs(true);
    setIsExpanded(false);
  };

  const addSkill = (skill) => {
    if (skill.trim() && !tempFilters.skills.includes(skill.trim())) {
      setTempFilters((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skill) => {
    setTempFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addTag = (tag) => {
    if (tag.trim() && !tempFilters.tags.includes(tag.trim())) {
      setTempFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const removeTag = (tag) => {
    setTempFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value;
      if (type === "skill") {
        addSkill(value);
      } else {
        addTag(value);
      }
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Filters & Search
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-primary hover:text-accent transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">Advanced Filters</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search jobs by title, description..."
          className="input-field pl-10"
          defaultValue={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., San Francisco, Remote, New York"
              className="input-field"
              value={tempFilters.location}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Skills
            </label>
            <input
              type="text"
              placeholder="Type a skill and press Enter"
              className="input-field mb-2"
              onKeyPress={(e) => handleKeyPress(e, "skill")}
            />
            <div className="flex flex-wrap gap-2">
              {tempFilters.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 skill-badge"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-primary/60 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              placeholder="Type a tag and press Enter"
              className="input-field mb-2"
              onKeyPress={(e) => handleKeyPress(e, "tag")}
            />
            <div className="flex flex-wrap gap-2">
              {tempFilters.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-dark border border-secondary/30"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-secondary/60 hover:text-secondary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button onClick={handleResetFilters} className="btn-secondary">
              Reset All
            </button>
            <button onClick={handleApplyFilters} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
