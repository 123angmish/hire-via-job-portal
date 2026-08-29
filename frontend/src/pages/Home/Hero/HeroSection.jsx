import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Button from "@mui/material/Button";
import { searchJobs } from "../../../store/candidate/jobSlice";

const TRENDING = ["React Developer", "Java Spring Boot", "Full Stack", "Data Analyst", "UI/UX Designer", "Product Manager"];

const HeroSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("jwt");
  const isEmployer = token && role === "EMPLOYER";
  const isLoggedIn = !!token;

  const handleSearch = (kw = keyword) => {
    const trimmedKeyword = kw.trim();
    const trimmedLocation = location.trim();
    if (!trimmedKeyword && !trimmedLocation) return;
    dispatch(searchJobs({ keyword: trimmedKeyword, location: trimmedLocation }));
    navigate(
      `/jobs?search=${encodeURIComponent(trimmedKeyword)}&location=${encodeURIComponent(trimmedLocation)}`
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-gradient-to-b from-[#eef7fa] via-[#f4f9fb] to-[#f8fafc] pb-16 pt-12 lg:pt-16 px-4 lg:px-12"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#1a6079]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-12 right-0 w-96 h-96 rounded-full bg-[#0284c7]/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-160 h-28 rounded-full bg-[#1a6079]/8 blur-2xl" />

      <div className="relative text-center max-w-5xl mx-auto">
        {isEmployer ? (
          /* ── EMPLOYER HERO VIEW ── */
          <>
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-[#1a6079]/20 text-[#1a6079] text-[12px] font-semibold px-4 py-1.5 rounded-full shadow-xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Employer Hiring Workspace — Streamlined Talent Acquisition
            </div>

            <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              Hire top talent for your{" "}
              <span className="relative inline-block text-[#1a6079]">
                organization
                <span className="absolute -bottom-1 left-0 w-full h-1 rounded-full bg-[#1a6079]/25" />
              </span>
              {" "}& projects
            </h1>

            <p className="text-slate-600 lg:w-[65%] lg:text-[16px] text-[14px] mx-auto mb-8 leading-relaxed font-normal">
              Post new job openings, review candidate applications in real time, and connect with qualified professionals ready to join your team.
            </p>

            {/* Employer Quick Action Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto mb-6">
              <button
                onClick={() => navigate("/employer/post-job")}
                className="flex flex-col items-center justify-center gap-2 p-4.5 rounded-2xl bg-[#1a6079] text-white hover:bg-[#124557] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer border border-[#1a6079]"
              >
                <DriveFolderUploadOutlinedIcon sx={{ fontSize: 28 }} />
                <span className="font-bold text-[14px]">Post New Job</span>
              </button>

              <button
                onClick={() => navigate("/employer/manage-jobs")}
                className="flex flex-col items-center justify-center gap-2 p-4.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-[#1a6079]/40 hover:text-[#1a6079] transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <ManageSearchOutlinedIcon sx={{ fontSize: 28, color: "#1a6079" }} />
                <span className="font-bold text-[14px]">Manage Jobs</span>
              </button>

              <button
                onClick={() => navigate("/employer/view-applicants")}
                className="flex flex-col items-center justify-center gap-2 p-4.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-[#1a6079]/40 hover:text-[#1a6079] transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "#1a6079" }} />
                <span className="font-bold text-[14px]">View Applicants</span>
              </button>

              <button
                onClick={() => navigate("/employer/company-profile")}
                className="flex flex-col items-center justify-center gap-2 p-4.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-[#1a6079]/40 hover:text-[#1a6079] transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <ApartmentOutlinedIcon sx={{ fontSize: 28, color: "#1a6079" }} />
                <span className="font-bold text-[14px]">Company Profile</span>
              </button>
            </div>
          </>
        ) : (
          /* ── CANDIDATE / GUEST HERO VIEW ── */
          <>
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-[#1a6079]/20 text-[#1a6079] text-[12px] font-semibold px-4 py-1.5 rounded-full shadow-xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Employer Job Openings & Career Portal
            </div>

            <h1 className="text-[28px] sm:text-[38px] lg:text-[50px] font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              Find a career that matches your{" "}
              <span className="relative inline-block text-[#1a6079]">
                passion
                <span className="absolute -bottom-1 left-0 w-full h-1 rounded-full bg-[#1a6079]/25" />
              </span>
              {" "}& skills
            </h1>

            <p className="text-slate-600 lg:w-[62%] lg:text-[16px] text-[13px] mx-auto mb-8 leading-relaxed font-normal">
              Discover real-time verified job opportunities across top industries, apply with your resume, and accelerate your career growth.
            </p>

            {/* Quick Portal Entrance Choice (When not logged in) */}
            {!isLoggedIn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                {/* Candidate Entry Card */}
                <div
                  onClick={() => navigate("/login?role=candidate")}
                  className="bg-white border-2 border-slate-200/90 hover:border-[#1a6079] rounded-2xl p-4.5 text-left transition-all shadow-xs hover:shadow-md cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center shrink-0 group-hover:bg-[#1a6079] group-hover:text-white transition-colors">
                      <PersonOutlineIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] text-slate-900 leading-snug">
                        I'm a Candidate
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Search jobs, apply & track ATS status
                      </p>
                    </div>
                  </div>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 18, color: "#1a6079" }} className="group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Employer Entry Card */}
                <div
                  onClick={() => navigate("/login?role=employer")}
                  className="bg-white border-2 border-slate-200/90 hover:border-[#1a6079] rounded-2xl p-4.5 text-left transition-all shadow-xs hover:shadow-md cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center shrink-0 group-hover:bg-[#1a6079] group-hover:text-white transition-colors">
                      <BusinessOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] text-slate-900 leading-snug">
                        I'm an Employer
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Post jobs, review applicants & chat
                      </p>
                    </div>
                  </div>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 18, color: "#1a6079" }} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Search Input Bar */}
            <div
              className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-full mx-auto w-full lg:w-[76%]
                px-4 lg:px-5 py-3 lg:py-2.5
                flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-0
                border border-slate-200/90 shadow-[0_10px_35px_rgba(26,96,121,0.08)]"
            >
              <div className="flex items-center gap-2.5 flex-1 px-1 lg:px-2">
                <SearchIcon sx={{ fontSize: 20, color: "#1a6079", flexShrink: 0 }} />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Job title, skills, keywords..."
                  className="w-full text-[14px] placeholder:text-slate-400 text-slate-800 outline-none border-none bg-transparent font-medium"
                />
              </div>

              <div className="hidden lg:block w-px h-6 bg-slate-200 mx-2 shrink-0" />

              <div className="flex items-center gap-2.5 flex-1 px-1 lg:px-2">
                <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#1a6079", flexShrink: 0 }} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="City, state or remote..."
                  className="w-full text-[14px] placeholder:text-slate-400 text-slate-800 outline-none border-none bg-transparent font-medium"
                />
              </div>

              <Button
                variant="contained"
                onClick={() => handleSearch()}
                sx={{
                  textTransform: "capitalize",
                  background: "#1a6079",
                  borderRadius: { xs: "12px", lg: "50px" },
                  px: { xs: 3, lg: 4 },
                  py: { xs: 1.1, lg: 1.2 },
                  fontSize: { xs: 13, md: 14 },
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: "0 2px 10px rgba(26,96,121,0.25)",
                  "&:hover": {
                    background: "#124557",
                    boxShadow: "0 4px 14px rgba(26,96,121,0.35)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Find Jobs
              </Button>
            </div>

            {/* Trending Keywords */}
            <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-[12px] font-semibold text-slate-400">
                <TrendingUpIcon sx={{ fontSize: 15, color: "#1a6079" }} />
                <span>Trending:</span>
              </div>
              {TRENDING.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setKeyword(tag);
                    handleSearch(tag);
                  }}
                  className="text-[12px] font-medium text-[#1a6079] bg-white/80 border border-[#1a6079]/20
                    px-3 py-0.5 rounded-full cursor-pointer
                    hover:bg-[#1a6079] hover:text-white hover:border-[#1a6079]
                    transition-all duration-200 shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;