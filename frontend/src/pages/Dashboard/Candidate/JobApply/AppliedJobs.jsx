import React, { useEffect } from "react";
import AppliedJobCard from "./AppliedJobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../../../store/candidate/applicationSlice";
import { Link } from "react-router-dom";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";

const AppliedJobs = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.application);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    dispatch(fetchApplications());

    // Auto-refresh applications every 5 seconds to sync employer decisions in real-time
    const interval = setInterval(() => {
      dispatch(fetchApplications());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const validApplications = Array.isArray(applications)
    ? applications.filter((app) => app && app.job && app.job.title)
    : [];

  return (
    <section className="lg:px-10 px-4 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Applied Jobs & Application Status
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track real-time employer decisions (Under Review, Interview, Offered, etc.) and chat directly with hiring teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            onClick={() => dispatch(fetchApplications())}
            sx={{
              textTransform: "capitalize",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "12px",
              borderColor: "#cbd5e1",
              color: "#475569",
            }}
          >
            Refresh
          </Button>

          {validApplications.length > 0 && (
            <span className="text-xs font-bold text-[#1a6079] bg-[#1a6079]/10 px-3 py-1.5 rounded-xl">
              {validApplications.length}{" "}
              {validApplications.length === 1 ? "Application" : "Applications"}
            </span>
          )}
        </div>
      </div>

      {loading && validApplications.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress size={32} sx={{ color: "#1a6079" }} />
        </div>
      ) : validApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto mt-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mx-auto mb-4">
            <WorkOutlineIcon sx={{ fontSize: 32 }} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Applications Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            You haven't applied to any jobs yet. Browse open opportunities and start applying to track your interview status and chat with employers!
          </p>
          <Link to="/find-jobs">
            <Button
              variant="contained"
              sx={{
                background: "#1a6079",
                textTransform: "capitalize",
                borderRadius: "12px",
                px: 3.5,
                py: 1.2,
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
                "&:hover": { background: "#124557" },
              }}
            >
              Find Jobs & Apply
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {validApplications.map((elem, idx) => (
            <AppliedJobCard
              key={elem?.id || idx}
              application={elem}
              job={elem.job}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AppliedJobs;
