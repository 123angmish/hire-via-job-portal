import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import FilterListIcon from "@mui/icons-material/FilterList";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import JobCard from "../Job/JobCard";
import { useSelector, useDispatch } from "react-redux";
import { sortJobs } from "../../store/candidate/jobSlice";

const JobListings = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.job);

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === "newest") {
      dispatch(sortJobs({ fieldName: "createdAt", order: "desc" }));
    } else if (val === "salary") {
      dispatch(sortJobs({ fieldName: "avgSalary", order: "desc" }));
    } else if (val === "experience") {
      dispatch(sortJobs({ fieldName: "requiredExperience", order: "asc" }));
    }
  };

  return (
    <section className="flex-1 w-full">
      <div className="pb-2 flex justify-between items-center">
        <h3 className="lg:text-[18px] text-[13px] font-semibold text-gray-800">
          {jobs ? jobs.length : 0} {jobs?.length === 1 ? "Job Found" : "Jobs Found"}
        </h3>
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden lg:flex items-center gap-1">
            <FilterListIcon sx={{ color: "#6b7280", fontSize: 18 }} />
            <span className="text-gray-500 lg:text-[14px] text-[12px] font-medium">
              Sort By:
            </span>
          </div>
          <Box sx={{ minWidth: { xs: 110, md: 140 } }}>
            <FormControl fullWidth size="small">
              <NativeSelect
                defaultValue="newest"
                onChange={handleSortChange}
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  color: "#1a6079",
                  fontWeight: 600,
                  "&:before": { borderBottomColor: "#1a6079/30" },
                }}
              >
                <option value="newest">Newest First</option>
                <option value="salary">Salary (High to Low)</option>
                <option value="experience">Experience</option>
              </NativeSelect>
            </FormControl>
          </Box>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#1a6079] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 shadow-xs mt-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mx-auto mb-3">
            <WorkOutlineOutlinedIcon sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-[17px] font-bold text-gray-800 mb-1">
            No Jobs Found
          </h3>
          <p className="text-[13px] text-gray-500 max-w-xs mx-auto">
            No live jobs match your current filters. Try changing your search query or reset filters!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:mt-6 mt-4 gap-4 lg:gap-6">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}
    </section>
  );
};

export default JobListings;
