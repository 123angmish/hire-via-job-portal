import React from "react";
import { Link } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useDispatch, useSelector } from "react-redux";
import { removeSaveJob, saveJob } from "../../store/candidate/saveJobSlice";

const JobCard = ({ job }) => {
  const getDaysLeft = (createdAt) => {
    if (!createdAt) return 30;
    const postedDate = new Date(createdAt);
    const expiryDate = new Date(postedDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const diffTime = expiryDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const dispatch = useDispatch();
  const { savedJobs, saveJobId, removeSaveJobId } = useSelector(
    (state) => state.saveJob,
  );
  const isSaved = savedJobs?.find((elem) => elem.job?.id === job?.id || elem?.id === job?.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isSaved ? dispatch(removeSaveJob(isSaved?.id)) : dispatch(saveJob(job?.id));
  };

  const daysLeft = getDaysLeft(job?.createdAt);
  const isExpiringSoon = daysLeft <= 5;

  const avatarColors = [
    "linear-gradient(135deg, #1a6079 0%, #0d4153 100%)",
    "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
    "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
  ];
  const avatarBg =
    avatarColors[
      (job?.company?.name?.charCodeAt(0) || 0) % avatarColors.length
    ];

  return (
    <Link to={`/job-details/${job?.id}`} className="col-span-1 block group">
      <div
        className="relative bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 h-full
        transition-all duration-250 ease-out
        hover:border-[#1a6079]/40 hover:shadow-[0_12px_32px_rgba(26,96,121,0.09)]
        hover:-translate-y-1 flex flex-col justify-between"
      >
        <div>
          {/* Header Row */}
          <div className="flex justify-between items-start mb-3.5">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white"
                style={{ background: avatarBg }}
              >
                <span
                  className="text-[19px] font-bold leading-none select-none"
                  style={{ fontFamily: "'Lily Script One', cursive" }}
                >
                  {job?.company?.name?.charAt(0) || "J"}
                </span>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-500 leading-none mb-1">
                  {job?.company?.name || "Company"}
                </p>
                <span className="text-[11px] font-medium text-[#1a6079] bg-[#1a6079]/8 px-2.5 py-0.5 rounded-full">
                  {job?.category?.name || "Technology & Development"}
                </span>
              </div>
            </div>

            <IconButton
              size="small"
              disabled={saveJobId === job?.id || removeSaveJobId === isSaved?.id}
              onClick={handleBookmark}
              sx={{
                color: isSaved ? "#1a6079" : "#94a3b8",
                "&:hover": { color: "#1a6079", background: "rgba(26,96,121,0.08)" },
                mt: -0.5,
                mr: -0.5,
              }}
            >
              {saveJobId === job?.id || removeSaveJobId === isSaved?.id ? (
                <CircularProgress size={16} sx={{ color: "#1a6079" }} />
              ) : isSaved ? (
                <BookmarkIcon sx={{ fontSize: 20 }} />
              ) : (
                <BookmarkBorderOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </div>

          {/* Job Title */}
          <h2
            className="text-[16px] lg:text-[17px] font-bold text-slate-900 leading-snug mb-3.5
            group-hover:text-[#1a6079] transition-colors line-clamp-2"
          >
            {job?.title}
          </h2>

          {/* Badges / Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium
              text-slate-600 bg-slate-100/90 rounded-lg py-1 px-2.5"
            >
              <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: "#64748b" }} />
              {job?.timing?.replaceAll("_", " ") || "Full Time"}
            </span>

            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium
              text-[#1a6079] bg-[#1a6079]/8 rounded-lg py-1 px-2.5"
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
              {job?.company?.location || "Remote"}
            </span>

            {job?.avgSalary && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold
                text-slate-700 bg-slate-100/90 rounded-lg py-1 px-2.5"
              >
                {job?.avgSalary}
              </span>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div>
          <div className="border-t border-dashed border-slate-200/80 mb-3" />

          <div className="flex justify-between items-center text-[12px]">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isExpiringSoon ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <p className="text-slate-500 font-medium">
                {daysLeft > 0 ? (
                  <>
                    <span
                      className={`font-semibold ${
                        isExpiringSoon ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {daysLeft}
                    </span>{" "}
                    days left
                  </>
                ) : (
                  <span className="text-rose-500 font-semibold">Closing soon</span>
                )}
              </p>
            </div>

            <span
              className="text-[#1a6079] font-bold inline-flex items-center gap-0.5
              group-hover:translate-x-0.5 transition-transform"
            >
              View Details <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
