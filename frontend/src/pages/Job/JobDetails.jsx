import React, { useEffect } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearJobDetails,
  fetchJobDetails,
} from "../../store/candidate/jobSlice";
import AboutJob from "./AboutJob";
import JobSummaryCard from "./JobSummaryCard";
import Button from "@mui/material/Button";
import { removeSaveJob, saveJob } from "../../store/candidate/saveJobSlice";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobDetails(id));

    return () => {
      dispatch(clearJobDetails());
    };
  }, [id, dispatch]);

  const { jobDetails } = useSelector((state) => state.job);

  const timeAgo = (dateString) => {
    if (!dateString) return "Recently posted";
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now - created;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const { applications } = useSelector((state) => state.application);
  const isApplied = applications?.find(
    (elem) => elem.job?.id === jobDetails?.id
  );

  const { savedJobs } = useSelector((state) => state.saveJob);
  const isSaved = savedJobs?.find((elem) => elem.job?.id === jobDetails?.id);

  const handleBookmark = () => {
    isSaved
      ? dispatch(removeSaveJob(isSaved?.id))
      : dispatch(saveJob(jobDetails?.id));
  };

  const companyInitial = jobDetails?.company?.name
    ? jobDetails.company.name.charAt(0).toUpperCase()
    : "J";

  return (
    <section className="lg:px-12 px-6 pt-4 pb-12 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="lg:flex justify-between items-start gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1a6079] to-[#0284c7] text-white flex justify-center items-center font-bold text-2xl shadow-md shrink-0 overflow-hidden">
              {jobDetails?.company?.logoUrl ? (
                <img
                  src={jobDetails.company.logoUrl}
                  className="w-full h-full object-contain p-2 bg-white"
                  alt={jobDetails?.company?.name || "Company"}
                />
              ) : (
                companyInitial
              )}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {jobDetails?.title || "Job Title"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <BusinessOutlinedIcon sx={{ fontSize: 16, color: "#1a6079" }} />
                  {jobDetails?.company?.name || "Company"}
                </span>
                {jobDetails?.company?.location && (
                  <span className="flex items-center gap-1">
                    <LocationOnOutlinedIcon sx={{ fontSize: 16, color: "#64748b" }} />
                    {jobDetails.company.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400">
                  <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />
                  {timeAgo(jobDetails?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 lg:mt-0">
            <button
              onClick={handleBookmark}
              className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#1a6079] hover:border-[#1a6079] transition-all bg-slate-50/50"
              title={isSaved ? "Saved" : "Save Job"}
            >
              {isSaved ? (
                <BookmarkIcon sx={{ color: "#1a6079" }} />
              ) : (
                <BookmarkBorderIcon />
              )}
            </button>

            {isApplied ? (
              <Button
                variant="contained"
                disabled
                sx={{
                  height: "48px",
                  px: 4,
                  borderRadius: "14px",
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                Already Applied
              </Button>
            ) : (
              <Link to={`/job-details/${jobDetails?.id}/apply`}>
                <Button
                  variant="contained"
                  sx={{
                    height: "48px",
                    px: 4,
                    borderRadius: "14px",
                    fontWeight: 700,
                    textTransform: "capitalize",
                    background: "#1a6079",
                    boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
                    "&:hover": { background: "#124557" },
                  }}
                >
                  Apply Now
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            <AboutJob jobDetails={jobDetails} />
          </div>

          <div className="lg:col-span-1">
            <JobSummaryCard jobDetails={jobDetails} />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            About Company
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a6079] to-[#0284c7] text-white flex justify-center items-center font-bold text-xl shadow-xs overflow-hidden shrink-0">
              {jobDetails?.company?.logoUrl ? (
                <img
                  src={jobDetails.company.logoUrl}
                  className="w-full h-full object-contain p-2 bg-white"
                  alt={jobDetails?.company?.name || "Company"}
                />
              ) : (
                companyInitial
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {jobDetails?.company?.name || "Company"}
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                {jobDetails?.company?.location || "Delhi, India"} {jobDetails?.company?.industry ? `• ${jobDetails.company.industry}` : ""}
              </p>
            </div>
          </div>

          {jobDetails?.company?.description && (
            <p className="text-sm text-slate-600 mt-4 leading-relaxed font-normal">
              {jobDetails.company.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
