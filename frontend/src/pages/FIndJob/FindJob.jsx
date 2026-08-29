import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Button from "@mui/material/Button";
import FilterAsideBar from "./FilterAsideBar";
import JobListings from "./JobListings";
import { searchJobs, fetchJobs } from "../../store/candidate/jobSlice";

const FindJob = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [openSlideBar, setOpenSlideBar] = useState(false);
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  useEffect(() => {
    const urlKeyword = searchParams.get("search") || "";
    const urlLocation = searchParams.get("location") || "";

    if (urlKeyword || urlLocation) {
      setKeyword(urlKeyword);
      setLocation(urlLocation);
      dispatch(searchJobs({ keyword: urlKeyword, location: urlLocation }));
    } else {
      dispatch(fetchJobs());
    }
  }, [searchParams, dispatch]);

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    const trimmedLocation = location.trim();

    if (!trimmedKeyword && !trimmedLocation) {
      setSearchParams({});
      dispatch(fetchJobs());
      return;
    }

    const params = {};
    if (trimmedKeyword) params.search = trimmedKeyword;
    if (trimmedLocation) params.location = trimmedLocation;
    setSearchParams(params);

    dispatch(searchJobs({ keyword: trimmedKeyword, location: trimmedLocation }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <section
        id="hero-section"
        className="bg-gradient-to-b from-[#eef7fa] to-[#f8fafc] pb-10 pt-12 lg:pt-16 px-4 lg:px-12 border-b border-slate-200/80"
      >
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#1a6079]/10 text-[#1a6079] text-[11px] font-bold rounded-full mb-3 uppercase tracking-wider">
            Verified Job Directory
          </span>

          <h1 className="text-[26px] sm:text-[34px] lg:text-[40px] font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">
            Search & Apply For Your Next{" "}
            <span className="text-[#1a6079]">Opportunity</span>
          </h1>

          <p className="text-slate-600 lg:text-[15px] text-[13px] max-w-2xl mx-auto mb-8 leading-relaxed">
            Filter through real job postings from verified employers. Match your skills, set your preferences, and apply instantly.
          </p>

          <div className="bg-white rounded-2xl lg:rounded-full p-2.5 sm:p-3 border border-slate-200/90 shadow-[0_8px_30px_rgba(26,96,121,0.08)] max-w-3xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            <div className="flex items-center gap-2.5 flex-1 px-3 py-1.5">
              <SearchIcon sx={{ fontSize: 20, color: "#1a6079" }} />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, skills, keywords..."
                className="w-full text-[14px] placeholder:text-slate-400 text-slate-800 outline-none border-none bg-transparent font-medium"
              />
            </div>

            <div className="hidden lg:block w-px h-6 bg-slate-200 mx-1" />

            <div className="flex items-center gap-2.5 flex-1 px-3 py-1.5">
              <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#1a6079" }} />
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
              onClick={handleSearch}
              sx={{
                textTransform: "capitalize",
                background: "#1a6079",
                borderRadius: { xs: "12px", lg: "50px" },
                px: 3.5,
                py: 1.1,
                fontSize: "14px",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(26,96,121,0.25)",
                "&:hover": { background: "#124557" },
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="lg:px-12 px-4 py-8 lg:py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 xl:hidden">
          <button
            onClick={() => setOpenSlideBar(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white text-[13px] font-semibold hover:border-[#1a6079]"
          >
            <TuneOutlinedIcon sx={{ fontSize: 16, color: "#1a6079" }} />
            Show Filters
          </button>
        </div>

        <div className="flex gap-8 items-start">
          <FilterAsideBar
            openSlideBar={openSlideBar}
            setOpenSlideBar={setOpenSlideBar}
          />
          <JobListings />
        </div>
      </div>
    </>
  );
};

export default FindJob;