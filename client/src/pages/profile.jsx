import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Upload,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Wallet,
  Plus,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useWeb3 } from "../context/web3Context";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuthStore();
  const { account, solanaAccount, connectMetaMask, disconnect } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate",
    yearsOfExperience: 1,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const { register, handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "https://careerfind-riseos.onrender.com/api/profile"
      );
      const data = response.data;
      setProfileData(data);
      setSkills(data.profile?.skills || []);

      if (data.profile) {
        Object.keys(data.profile).forEach((key) => {
          if (key !== "skills") {
            setValue(`profile.${key}`, data.profile[key]);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        ...data,
        profile: {
          ...data.profile,
          skills,
        },
      };

      await axios.put(
        "https://careerfind-riseos.onrender.com/api/profile",
        updateData
      );
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated");
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!avatarFile && !resumeFile) return;

    const formData = new FormData();
    if (avatarFile) formData.append("avatar", avatarFile);
    if (resumeFile) formData.append("resume", resumeFile);

    try {
      await axios.post(
        "https://careerfind-riseos.onrender.com/api/profile/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess("File uploaded successfully!");
      toast.success("File uploaded!");
      fetchProfile();
      setAvatarFile(null);
      setResumeFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload files");
      toast;
      console.log(err);
    }
  };
  const addSkill = () => {
    if (newSkill.name.trim() && !skills.find((s) => s.name === newSkill.name)) {
      setSkills([...skills, newSkill]);
      setNewSkill({ name: "", level: "Intermediate", yearsOfExperience: 1 });
    }
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const connectWallet = async (network) => {
    try {
      let address = "";
      if (network === "ethereum") {
        await connectMetaMask();
        address = account || "";
      }

      if (address) {
        await axios.post(
          "https://careerfind-riseos.onrender.com/api/profile/connect-wallet",
          { network, address }
        );
        setSuccess(`${network} wallet connected successfully!`);
        console.log("address", address);
        console.log("profile", profileData);
        fetchProfile();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to connect ${network} wallet`
      );
    }
  };

  const disconnectWallet = async (network) => {
    try {
      await axios.post(
        "https://careerfind-riseos.onrender.com/api/profile/disconnect-wallet",
        { network }
      );
      disconnect();
      setSuccess(`${network} wallet disconnected successfully!`);
      fetchProfile();
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to disconnect ${network} wallet`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-neutral-600">
          Manage your professional profile and Web3 integrations
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {profileData?.profile?.avatar ? (
                  <img
                    src={profileData.profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">
                {user?.name}
              </h3>
              <p className="text-neutral-600">
                {profileData?.profile?.title || "Professional"}
              </p>
            </div>

            {/* File Uploads */}
            <div className="space-y-4 mb-6">
              {/*<div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>*/}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Resume (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>

              {(avatarFile || resumeFile) && (
                <button
                  onClick={handleFileUpload}
                  className="w-full btn-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </button>
              )}
            </div>

            {/* Web3 Wallets */}
            <div className="border-t border-neutral-200 pt-6">
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                Web3 Wallets
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">MetaMask</p>
                      <p className="text-sm text-neutral-600">
                        Ethereum & Polygon
                      </p>
                    </div>
                  </div>
                  {profileData?.wallets?.ethereum?.isConnected ? (
                    <button
                      onClick={() => disconnectWallet("ethereum")}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => connectWallet("ethereum")}
                      className="text-sm text-primary hover:text-accent"
                    >
                      Connect
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-5 w-5 text-secondary-dark" />
                    <div>
                      <p className="text-sm text-neutral-600">
                        Meta Mask Adress
                      </p>
                      {profileData?.wallets?.ethereum?.isConnected && (
                        <div className="mt-1 px-2 py-1 bg-neutral-100 border border-neutral-300 rounded text-xs font-mono truncate max-w-[200px]">
                          {`${profileData.wallets.ethereum.address.slice(
                            0,
                            6
                          )}...${profileData.wallets.ethereum.address.slice(
                            -4
                          )}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Senior Frontend Developer"
                    {...register("profile.title")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., San Francisco, CA"
                    {...register("profile.location")}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell us about yourself..."
                  {...register("profile.bio")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Experience
                  </label>
                  <textarea
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Your work experience..."
                    {...register("profile.experience")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Education
                  </label>
                  <textarea
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Your educational background..."
                    {...register("profile.education")}
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Skills
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  className="input-field"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                />
                <select
                  className="input-field"
                  value={newSkill.level}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, level: e.target.value })
                  }
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="Years"
                    className="input-field"
                    value={newSkill.yearsOfExperience}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-primary px-4"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-2 rounded-full border border-primary/20"
                  >
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                      {skill.level}
                    </span>
                    <span className="text-xs">{skill.yearsOfExperience}y</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.name)}
                      className="text-primary/60 hover:text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Social Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Github className="h-4 w-4 inline mr-2" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://github.com/username"
                    {...register("profile.socialLinks.github")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Linkedin className="h-4 w-4 inline mr-2" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://linkedin.com/in/username"
                    {...register("profile.socialLinks.linkedin")}
                  />
                </div>
              </div>
            </div>

            {/* Job Preferences */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Job Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Salary ($)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="50000"
                    {...register("profile.preferences.salaryRange.min")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Maximum Salary ($)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="150000"
                    {...register("profile.preferences.salaryRange.max")}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    {...register("profile.preferences.remoteWork")}
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Open to remote work
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                    {...register("profile.preferences.availableForWork")}
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Available for work
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
