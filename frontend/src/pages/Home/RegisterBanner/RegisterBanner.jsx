import Button from "@mui/material/Button";
import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import careerGrowthBanner from "../../../assets/career-growth-banner.png";

const RegisterBanner = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("jwt");
  const isEmployer = token && role === "EMPLOYER";

  return (
    <section className="px-4 lg:px-12 py-10 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#144b5f] via-[#1a6079] to-[#0f3b4c] text-white p-8 sm:p-12 lg:p-14 shadow-xl">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-xs text-cyan-200 text-[11px] font-bold rounded-full mb-4 uppercase tracking-wider">
            {isEmployer ? "For Fast-Growing Teams" : "Accelerate Your Career"}
          </span>

          <h2 className="text-[22px] sm:text-[30px] lg:text-[34px] font-extrabold leading-tight mb-3 tracking-tight">
            {isEmployer
              ? "Ready to build your team? Post your next job listing today!"
              : "Ready for your next big step? Create your career profile today!"}
          </h2>

          <p className="text-white/80 text-[13px] sm:text-[15px] leading-relaxed mb-6">
            {isEmployer
              ? "Connect with skilled candidates, manage applicant pipelines, review verified resumes, and hire the best talent faster."
              : "Stand out to top employers with your skills and resume. Receive AI matched recommendations and apply with ease."}
          </p>

          <Button
            onClick={() =>
              navigate(isEmployer ? "/employer/post-job" : "/jobs")
            }
            sx={{
              textTransform: "capitalize",
              color: "#144b5f",
              backgroundColor: "#ffffff",
              px: { xs: 3, md: 4 },
              py: 1.2,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#f0f9ff" },
            }}
          >
            <span className="flex items-center gap-1.5">
              {isEmployer ? "Post A Job Now" : "Explore Open Jobs"}
              <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
            </span>
          </Button>
        </div>

        <div className="hidden lg:block absolute -bottom-2 right-12 opacity-90 pointer-events-none">
          <img
            className="w-[180px]"
            src={careerGrowthBanner}
            alt="Career Growth"
          />
        </div>
      </div>
    </section>
  );
};

export default RegisterBanner;
