import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ChatModal from "../../../../components/Chat/ChatModal";

const STATUS_COLORS = {
  APPLIED: { color: "#4b5563", bg: "#f3f4f6", label: "Applied" },
  UNDER_REVIEW: { color: "#b45309", bg: "#fef3c7", label: "Under Review" },
  SHORTLISTED: { color: "#1d4ed8", bg: "#dbeafe", label: "Shortlisted" },
  INTERVIEW: { color: "#7c3aed", bg: "#ede9fe", label: "Interview Scheduled" },
  OFFERED: { color: "#15803d", bg: "#dcfce7", label: "Job Offered 🎉" },
  REJECTED: { color: "#b91c1c", bg: "#fee2e2", label: "Not Selected" },
};

const formatStatus = (status) => {
  if (!status) return "Applied";
  return STATUS_COLORS[status]?.label || (status.charAt(0) + status.slice(1).toLowerCase().replace("_", " "));
};

const AppliedJobCard = ({ job, application }) => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const getDaysLeft = (createdAt) => {
    if (!createdAt) return 30;
    const postedDate = new Date(createdAt);
    const expiryDate = new Date(postedDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const diffTime = expiryDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const status = application?.status || "APPLIED";
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.APPLIED;

  const companyInitial = job?.company?.name
    ? job.company.name.charAt(0).toUpperCase()
    : "J";

  return (
    <>
      <div className="col-span-1 bg-white border border-slate-200/90 rounded-3xl p-5 lg:p-6 transition-all duration-300 hover:border-[#1a6079]/40 hover:shadow-lg hover:-translate-y-1 relative flex flex-col justify-between">
        <div>
          {/* Header Row: Company Avatar + Title + Live Status Badge */}
          <div className="flex justify-between items-start gap-3 mb-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a6079] to-[#0284c7] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0 overflow-hidden">
                {job?.company?.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={job?.company?.name}
                    className="w-full h-full object-contain p-1.5 bg-white"
                  />
                ) : (
                  companyInitial
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-semibold truncate leading-none mb-1">
                  {job?.company?.name || "Company"}
                </p>
                <h3
                  onClick={() => navigate(`/job-details/${job?.id}`)}
                  className="text-base font-bold text-slate-900 leading-snug truncate hover:text-[#1a6079] cursor-pointer transition-colors"
                >
                  {job?.title || "Job Position"}
                </h3>
              </div>
            </div>

            {/* Status Pill Badge with pulse dot */}
            <span
              className="text-xs font-bold px-3 py-1 rounded-full shrink-0 flex items-center gap-1.5 shadow-2xs"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: statusStyle.color }}
              />
              {formatStatus(status)}
            </span>
          </div>

          {/* Job Details Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg py-1 px-2.5">
              <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
              {job?.timing?.replaceAll("_", " ") || "Full Time"}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a6079] bg-[#1a6079]/10 rounded-lg py-1 px-2.5">
              <LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
              {job?.company?.location || "Delhi, India"}
            </span>

            {job?.avgSalary && (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg py-1 px-2.5">
                {job.avgSalary}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-3">
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1a6079] hover:bg-[#124557] px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
            Chat with Employer
          </button>

          <button
            onClick={() => navigate(`/job-details/${job?.id}`)}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#1a6079] transition-colors"
          >
            View Job
            <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      </div>

      <ChatModal
        open={chatOpen}
        handleClose={() => setChatOpen(false)}
        applicationId={application?.id}
        jobTitle={job?.title}
        otherPartyName={job?.company?.name || "Employer"}
        isEmployer={false}
      />
    </>
  );
};

export default AppliedJobCard;
