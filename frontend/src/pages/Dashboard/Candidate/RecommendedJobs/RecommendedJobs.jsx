import React, { useEffect } from "react";
import JobCard from "../../../Job/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedJobs } from "../../../../store/candidate/recommendedJobsSlice";
import { fetchUserProfile } from "../../../../store/candidate/userSlice";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
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

  // Calculate dynamic AI match metrics for each job
  const getAIMatchDetails = (job) => {
    const userSkills = (user?.skills || []).map((s) => s.toLowerCase().trim());
    const jobSkills = (job?.requiredSkills || []).map((s) => s.toLowerCase().trim());

    if (userSkills.length === 0 || jobSkills.length === 0) {
      return { score: 85, matched: [], missing: job?.requiredSkills || [] };
    }

    const matched = [];
    const missing = [];

    (job?.requiredSkills || []).forEach((skill) => {
      const sLower = skill.toLowerCase().trim();
      const isMatched = userSkills.some((uSkill) => uSkill.includes(sLower) || sLower.includes(uSkill));
      if (isMatched) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const matchRatio = matched.length / Math.max(jobSkills.length, 1);
    const score = Math.min(Math.max(Math.round(matchRatio * 50 + 50), 65), 98);

    return { score, matched, missing };
  };

  return (
    <section className="lg:px-10 px-4 pb-12.5 lg:pb-10">
      {/* AI Header Banner */}
      <div className="bg-gradient-to-r from-[#eef8fc] via-[#f8fafc] to-white border border-[#1a6079]/25 rounded-3xl p-6 lg:p-7 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a6079] to-[#0284c7] text-white flex items-center justify-center shadow-xs">
              <AutoAwesomeOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h2 className="lg:text-[22px] text-[18px] font-extrabold text-slate-900">
                AI Job Match & Compatibility Engine
              </h2>
              <p className="text-[12px] text-slate-500 font-medium">
                Personalized openings ranked in real-time by your technical profile & skills
              </p>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1a6079] bg-[#1a6079]/10 hover:bg-[#1a6079]/20 px-3.5 py-1.5 rounded-xl transition-colors border border-[#1a6079]/20"
          >
            <EditOutlinedIcon sx={{ fontSize: 15 }} />
            Edit Profile Skills
          </Link>
        </div>

        <p className="text-slate-600 text-[13px] lg:text-[14px] mt-2 leading-relaxed">
          {user?.skills && user.skills.length > 0
            ? "Our intelligent recommendation engine compares your technical skills, experience level, and resume keywords against all live postings to calculate match scores and skill alignments."
            : "Add your skills and resume in profile settings to activate real-time AI job recommendations!"}
        </p>

        {/* User Skills & Resume Preview */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-slate-200/80">
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
            Active Match Profile:
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
          <p className="text-sm font-semibold text-slate-500">AI is matching best-fit openings for you...</p>
        </div>
      ) : recommendedJobs && recommendedJobs.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="text-[14px] font-bold text-slate-700">
              Top AI Matched Openings ({recommendedJobs.length})
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
            {recommendedJobs.map((j, index) => {
              const { score, matched, missing } = getAIMatchDetails(j);

              return (
                <div
                  key={j.id || index}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-[#1a6079]/40 hover:shadow-md transition-all"
                >
                  {/* Match Score Banner */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ✨ {score}% AI Compatibility Match
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400">
                      {matched.length > 0 ? `${matched.length} Skills Matched` : "High Profile Fit"}
                    </span>
                  </div>

                  {/* Standard Job Card Component */}
                  <div className="mb-4">
                    <JobCard job={j} />
                  </div>

                  {/* AI Skill Breakdown */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 text-xs space-y-2 mt-2">
                    {matched.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                          <CheckCircleIcon sx={{ fontSize: 13 }} /> Matched:
                        </span>
                        {matched.map((m, i) => (
                          <span
                            key={i}
                            className="bg-emerald-100/80 text-emerald-800 font-semibold px-2 py-0.5 rounded-md text-[11px]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {missing.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-500 inline-flex items-center gap-1">
                          <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 13, color: "#64748b" }} /> Skill Recommendations:
                        </span>
                        {missing.slice(0, 3).map((m, i) => (
                          <span
                            key={i}
                            className="bg-slate-200/70 text-slate-700 font-medium px-2 py-0.5 rounded-md text-[11px]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
