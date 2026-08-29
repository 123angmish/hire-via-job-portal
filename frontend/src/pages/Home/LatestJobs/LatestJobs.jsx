import React from "react";
import { Link } from "react-router-dom";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Button from "@mui/material/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import JobCard from "../../Job/JobCard";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { jobs, loading } = useSelector((state) => state.job);
  const role = localStorage.getItem("role");
  const isEmployer = role === "EMPLOYER";

  return (
    <section className="lg:px-12 px-6 py-7.5 lg:py-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="lg:text-[24px] text-[18px] font-bold text-gray-800">
            Latest Jobs
          </h2>
          <p className="lg:text-[14px] text-[12px] text-[#676666] mt-0.5">
            {jobs && jobs.length > 0
              ? `${jobs.length} ${jobs.length === 1 ? "live opening" : "live openings"} from registered employers`
              : "Live openings posted by verified employers"}
          </p>
        </div>

        {jobs && jobs.length > 0 && (
          <Link
            to="/jobs"
            className="text-[#1a6079] font-semibold text-[12px] lg:text-[15px] flex items-center hover:underline"
          >
            View All Jobs
            <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1a6079] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto my-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mx-auto mb-3">
            <WorkOutlineOutlinedIcon sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-[17px] font-bold text-gray-800 mb-1">
            No Job Openings Posted Yet
          </h3>
          <p className="text-[13px] text-gray-500 mb-5">
            Real jobs posted by employers will appear here in real-time. Are you an employer? Post the first job opening now!
          </p>
          <Link to="/employer/post-job">
            <Button
              variant="contained"
              sx={{
                background: "#1a6079",
                textTransform: "capitalize",
                borderRadius: "10px",
                px: 3,
                py: 1,
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": { background: "#154f63" },
              }}
            >
              Post A Job Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {jobs.map((j, index) => (
              <SwiperSlide key={j.id || index}>
                <JobCard job={j} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default LatestJobs;
