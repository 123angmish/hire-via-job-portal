import React, { useEffect } from "react";
import JobCard from "../../../Job/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedJobs } from "../../../../store/candidate/recommendedJobsSlice";
import { fetchUserProfile } from "../../../../store/candidate/userSlice";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const RecommendedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    dispatch(fetchUserProfile());
    dispatch(fetchRecommendedJobs());
  }, [dispatch]);

  const { recommendedJobs, loading } = useSelector((state) => state.recommendedJobs);
  const { user } = useSelector((state) => state.user);

  const getResumeDisplayLabel = (resume) => {
    if (!resume) return null;
    if (resume.startsWith("http://") || resume.startsWith("https://")) {
      const parts = resume.split("/");
      const last = parts[parts.length - 1];
      if (last.toLowerCase().endsWith(".pdf")) {
        return decodeURIComponent(last);
      }
      return "PDF Resume Attached";
    }
    return resume;
  };

  return (
    <section className="lg:px-10 px-4 pb-12.5 lg:pb-10">
      <div className="bg-gradient-to-r from-[#f0f7fa] via-[#f8fafc] to-white border border-[#1a6079]/25 rounded-3xl p-6 lg:p-7 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center">
              <AutoAwesomeOutlinedIcon sx={{ color: "#1a6079", fontSize: 22 }} />
            </div>
            <div>
              <h2 className="lg:text-[22px] text-[18px] font-extrabold text-slate-900">
                AI Job Match & Recommendations
              </h2>
              <p className="text-[12px] text-slate-500 font-medium">
                Personalized openings ranked by your technical profile & skills
              </p>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1a6079] bg-[#1a6079]/10 hover:bg-[#1a6079]/20 px-3.5 py-1.5 rounded-xl transition-colors border border-[#1a6079]/20"
          >
            <EditOutlinedIcon sx={{ fontSize: 15 }} />
            Edit Skills / Resume
          </Link>
        </div>

        <p className="text-slate-600 text-[13px] lg:text-[14px] mt-2 leading-relaxed">
          {user?.skills && user.skills.length > 0
            ? "Our intelligent recommendation engine analyzes your listed skills, bio, and resume keywords to match the most relevant active jobs."
            : "Add your skills and resume in profile settings to activate real-time AI job recommendations!"}
        </p>

        {/* User Skills & Resume Preview */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-slate-200/80">
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
            Active Match Filters:
          </span>

          {user?.resume && (
            <Chip
              icon={<DescriptionOutlinedIcon sx={{ fontSize: 15, color: "#047857" }} />}
              label={getResumeDisplayLabel(user.resume)}
              size="small"
              sx={{
                bgcolor: "#ecfdf5",
                color: "#065f46",
                border: "1px solid #a7f3d0",
                fontWeight: 700,
                fontSize: "11px",
                borderRadius: "8px",
              }}
            />
          )}

          {user?.skills && user.skills.length > 0 ? (
            user.skills.map((s, idx) => (
              <Chip
                key={idx}
                label={s}
                size="small"
                sx={{
                  bgcolor: "#f0f9ff",
                  color: "#0369a1",
                  border: "1px solid #bae6fd",
                  fontWeight: 600,
                  fontSize: "11px",
                  borderRadius: "8px",
                }}
              />
            ))
          ) : (
            <span className="text-[12px] text-slate-400 italic">No skills listed yet</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-[#1a6079] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Matching the best openings for you...</p>
        </div>
      ) : recommendedJobs && recommendedJobs.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="text-[14px] font-bold text-slate-700">
              Top Matched Openings ({recommendedJobs.length})
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {recommendedJobs.map((j, index) => (
              <div key={j.id || index} className="relative">
                <JobCard job={j} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/90 shadow-xs max-w-lg mx-auto p-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mx-auto mb-3">
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-[17px] font-bold text-slate-900 mb-1">
            No Specific Job Recommendations Found
          </h3>
          <p className="text-[13px] text-slate-500 mb-6 px-4">
            Add more skills to your profile or explore all active job openings on the portal to find the best match!
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/profile/edit">
              <Button
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  borderColor: "#1a6079",
                  color: "#1a6079",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "13px",
                  px: 2.5,
                  py: 1,
                  "&:hover": { background: "rgba(26,96,121,0.06)" },
                }}
              >
                Add Skills to Profile
              </Button>
            </Link>
            <Link to="/jobs">
              <Button
                variant="contained"
                sx={{
                  background: "#1a6079",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "13px",
                  px: 2.5,
                  py: 1,
                  "&:hover": { background: "#124557" },
                }}
              >
                Browse All Jobs
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecommendedJobs;
