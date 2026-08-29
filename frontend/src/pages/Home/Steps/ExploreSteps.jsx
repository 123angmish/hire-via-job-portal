import React from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

const ExploreSteps = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("jwt");
  const isEmployer = token && role === "EMPLOYER";

  const steps = isEmployer
    ? [
        {
          num: 1,
          title: "Setup Company Profile",
          desc: "Set up company branding, location, industry, and contact info.",
        },
        {
          num: 2,
          title: "Publish Job Openings",
          desc: "Create and publish detailed job requirements, skills, and salaries.",
        },
        {
          num: 3,
          title: "Review & Hire Talent",
          desc: "Inspect candidate resumes, view AI match ratings, and recruit top talent.",
        },
      ]
    : [
        {
          num: 1,
          title: "Create Your Profile",
          desc: "Sign up, specify your key skills, and upload your latest resume.",
        },
        {
          num: 2,
          title: "Discover Real Opportunities",
          desc: "Search openings or let our AI engine recommend jobs matching your resume.",
        },
        {
          num: 3,
          title: "Apply In One Click",
          desc: "Submit your profile and resume instantly to verified employers.",
        },
      ];

  return (
    <section className="lg:px-12 px-6 py-14 lg:py-20 bg-slate-50/70">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="lg:text-[26px] text-[20px] font-extrabold text-slate-900 tracking-tight">
          How It <span className="text-[#1a6079]">Works</span>
        </h2>
        <p className="lg:text-[15px] text-[13px] text-slate-500 mt-1.5">
          {isEmployer
            ? "Follow these 3 simple steps to recruit top talent for your organization"
            : "Follow these 3 simple steps to land your next dream career opportunity"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="relative bg-white border border-slate-200/90 rounded-2xl p-7 text-center shadow-xs hover:shadow-md hover:border-[#1a6079]/30 transition-all group"
          >
            <div
              className={`w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center font-extrabold text-[20px] transition-transform group-hover:scale-105 ${
                idx === 1
                  ? "bg-[#1a6079]/10 text-[#1a6079]"
                  : "bg-[#1a6079] text-white shadow-md shadow-[#1a6079]/20"
              }`}
            >
              {step.num}
            </div>

            <h3 className="font-bold text-[16px] lg:text-[17px] text-slate-900 mb-2">
              {step.title}
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreSteps;
