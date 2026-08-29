import React from "react";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const HIGHLIGHTS = [
  {
    icon: <BoltOutlinedIcon sx={{ fontSize: 32, color: "#1a6079" }} />,
    title: "Instant ATS Pipeline",
    description:
      "Track your application status in real-time as employers review, shortlist, and schedule interviews.",
  },
  {
    icon: <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 32, color: "#1a6079" }} />,
    title: "Direct Recruiter Chat",
    description:
      "Connect and chat directly with hiring teams to discuss job requirements, timings, and next steps.",
  },
  {
    icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 32, color: "#1a6079" }} />,
    title: "Smart AI Recommendations",
    description:
      "Intelligent skill-matching algorithms that highlight the most relevant career opportunities for your profile.",
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 32, color: "#1a6079" }} />,
    title: "Verified Real Employers",
    description:
      "Every company and job posting is 100% verified with direct access to actual recruiters.",
  },
];

const Testimonials = () => {
  return (
    <section className="lg:px-12 px-6 py-14 lg:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[12px] font-bold text-[#1a6079] uppercase tracking-widest mb-2">
            Why Choose HireVia
          </p>
          <h2 className="lg:text-[32px] text-[22px] font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Hiring & Career Growth
          </h2>
          <p className="text-slate-500 text-[13px] lg:text-[15px] mt-2 max-w-xl mx-auto">
            Everything candidates and employers need to connect, communicate, and hire efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#1a6079]/40 hover:shadow-lg transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1a6079]/10 flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;