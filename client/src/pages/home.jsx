import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Search, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-neutral-900">
                Career Find
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Find Your Perfect
              <span className="text-primary block">Career Opportunity</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Connect with top employers and discover job opportunities that
              match your skills. Join thousands of professionals building their
              careers with Career Find.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Start Job Hunting
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose Career Find?
            </h2>
            <p className="text-lg text-neutral-600">
              Everything you need to advance your career in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Smart Search
              </h3>
              <p className="text-neutral-600">
                Advanced filters to find jobs that perfectly match your skills
                and preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Professional Network
              </h3>
              <p className="text-neutral-600">
                Connect with industry professionals and expand your career
                network
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Quality Jobs
              </h3>
              <p className="text-neutral-600">
                Curated job listings from verified companies and trusted
                employers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Instant Updates
              </h3>
              <p className="text-neutral-600">
                Get notified immediately when new opportunities match your
                criteria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join Career Find today and discover opportunities that will shape
            your future
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-lg"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
