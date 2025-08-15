import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  IndianRupee,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "../store/authStore";

const JobCard = ({ job, onDelete }) => {
  const { user } = useAuthStore();
  const isOwner = user?.id === job.author._id;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      onDelete?.(job._id);
    }
  };

  return (
    <div className="card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            {job.title}
          </h3>
          <p className="text-neutral-600 mb-3 line-clamp-3">
            {job.description}
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center space-x-2 ml-4">
            <Link
              to={`/edit-job/${job._id}`}
              className="p-2 text-neutral-500 hover:text-primary transition-colors rounded-lg hover:bg-neutral-100"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-neutral-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, index) => (
          <span key={index} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-dark border border-secondary/30"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>

          {(job.salary || job.budget) && (
            <div className="flex items-center space-x-1">
              <IndianRupee className="h-4 w-4" />
              <span>{job.salary || `$${job.budget?.toLocaleString()}`}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDistanceToNow(new Date(job.createdAt))} ago</span>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            Posted by{" "}
            <span className="font-medium text-neutral-900">
              {job.author.name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
