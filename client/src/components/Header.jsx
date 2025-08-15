import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Plus, LogOut, User, Settings } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/jobs" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-neutral-900">
              Career Find
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/create-job"
              className="flex items-center space-x-2 btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Post Job</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <User className="h-5 w-5 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">
                  {user?.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
