import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useJobStore } from "../store/jobStore";
import { sendPlatformFee } from "../utils/payment.js";
import toast from "react-hot-toast";

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob } = useJobStore();
  const [skills, setSkills] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await sendPlatformFee();

      await createJob({
        ...data,
        skills,
        tags,
        budget: data.budget || undefined,
      });
      toast.success("Job created successfully!");
      navigate("/jobs");
    } catch (err) {
      setError(
        err.message || "Payment or job creation failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = e.currentTarget.value.trim();
      if (skill && !skills.includes(skill)) {
        setSkills([...skills, skill]);
        e.currentTarget.value = "";
      }
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = e.currentTarget.value.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Post a New Job
        </h1>
        <p className="text-neutral-600">
          Share your opportunity with talented professionals
        </p>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Senior Frontend Developer"
              {...register("title", { required: "Job title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Job Description *
            </label>
            <textarea
              rows={6}
              className="input-field resize-none"
              placeholder="Describe the role, responsibilities, requirements..."
              {...register("description", {
                required: "Job description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Required Skills *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Type a skill and press Enter"
              onKeyPress={addSkill}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 skill-badge"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-primary/60 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            {skills.length === 0 && (
              <p className="text-neutral-500 text-sm mt-1">
                Add skills by typing and pressing Enter
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., San Francisco, Remote, New York"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Salary/Budget
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., $80k-120k, $50/hour"
                {...register("salary")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Type a tag and press Enter (e.g., remote, urgent, startup)"
              onKeyPress={addTag}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-dark border border-secondary/30"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-secondary/60 hover:text-secondary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
