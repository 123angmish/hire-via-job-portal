import React, { useEffect } from "react";
import JobCard from "../../../Job/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedJobs } from "../../../../store/candidate/saveJobSlice";
import { Link } from "react-router-dom";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((state) => state.saveJob);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    dispatch(fetchSavedJobs());
  }, [dispatch]);

  return (
    <section className="lg:px-10 px-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="lg:text-[22px] text-[18px] font-bold text-gray-800">
            Saved Jobs
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Keep track of job openings you're interested in
          </p>
        </div>

        {savedJobs && savedJobs.length > 0 && (
          <span className="text-[12px] font-semibold text-[#1a6079] bg-[#1a6079]/10 px-3 py-1 rounded-full">
            {savedJobs.length} {savedJobs.length === 1 ? "Job" : "Jobs"} Saved
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress size={32} sx={{ color: "#1a6079" }} />
        </div>
      ) : !savedJobs || savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto mt-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mx-auto mb-4">
            <BookmarkBorderOutlinedIcon sx={{ fontSize: 32 }} />
          </div>
          <h3 className="text-[17px] font-bold text-gray-800 mb-1">
            No Saved Jobs Yet
          </h3>
          <p className="text-[13px] text-gray-500 mb-6">
            You haven't bookmarked any jobs yet. Browse open opportunities and click the bookmark icon on any job card to save it here!
          </p>
          <Link to="/jobs">
            <Button
              variant="contained"
              sx={{
                background: "#1a6079",
                textTransform: "capitalize",
                borderRadius: "10px",
                px: 3.5,
                py: 1,
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": { background: "#154f63" },
              }}
            >
              Explore Open Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 mt-6 lg:gap-6 gap-4">
          {savedJobs.map((elem) => (
            <JobCard key={elem?.id || elem?.job?.id} job={elem?.job || elem} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SavedJobs;
