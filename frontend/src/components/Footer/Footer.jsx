import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer style={{ background: "linear-gradient(180deg, #144b5f 0%, #0d323f 100%)" }} className="text-white lg:px-16 px-6 pt-12 pb-6 border-t border-[#1a6079]/30">
      {/* Top Footer Action Bar */}
      <div className="pb-10 flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-white/15">
        <div className="flex items-center gap-3">
          <Link to="/" className="logo font-bold text-white text-[22px] tracking-tight">
            Hire Via
          </Link>
          <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full text-cyan-200">
            Career Platform
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="border border-white/40 hover:border-white rounded-full px-5 py-2 text-[13px] font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
          >
            Find Opportunities
          </Link>

          <Link
            to="/employer/post-job"
            className="bg-white hover:bg-cyan-50 text-[#144b5f] rounded-full px-5 py-2 text-[13px] font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Post a Job
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-[16px] lg:text-[18px] mb-2">
              Stay Updated on Careers
            </h3>
            <p className="text-white/70 text-[13px] leading-relaxed mb-5 max-w-sm">
              Subscribe to get curated job recommendations, hiring alerts, and career insights delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-300 text-[13px] font-semibold py-2">
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <div className="relative flex items-center">
                  <EmailOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: "rgba(255,255,255,0.6)",
                      position: "absolute",
                      left: 14,
                    }}
                  />
                  <input
                    className="w-full bg-white/10 border border-white/20 focus:border-white/60 focus:bg-white/15 rounded-xl pl-10 pr-12 py-2.5 text-[13px] placeholder:text-white/50 text-white outline-none transition-all"
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 bg-white text-[#144b5f] hover:bg-cyan-100 h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                  >
                    <EastOutlinedIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-bold text-[15px] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-cyan-300 after:rounded-full">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[13px] text-white/75">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Find Open Jobs
                </Link>
              </li>
              <li>
                <Link to="/profile/recommended-jobs" className="hover:text-white transition-colors">
                  AI Job Match
                </Link>
              </li>
              <li>
                <Link to="/profile/saved-jobs" className="hover:text-white transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/employer/post-job" className="hover:text-white transition-colors">
                  Employer Hiring
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-white font-bold text-[15px] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-cyan-300 after:rounded-full">
              Support
            </h4>
            <ul className="space-y-2.5 text-[13px] text-white/75">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Candidate Help
                </Link>
              </li>
              <li>
                <Link to="/employer/company-profile" className="hover:text-white transition-colors">
                  Employer Guides
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy & Terms
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Security Standards
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-1">
            <h4 className="text-white font-bold text-[15px] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-cyan-300 after:rounded-full">
              Contact
            </h4>
            <ul className="space-y-3 text-[13px] text-white/80">
              <li className="flex items-start gap-2">
                <FmdGoodOutlinedIcon sx={{ fontSize: 18, color: "#67e8f9", mt: 0.2 }} />
                <span>Delhi, India</span>
              </li>
              <li>
                <a
                  href="tel:+919717017909"
                  className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                >
                  <LocalPhoneOutlinedIcon sx={{ fontSize: 18, color: "#67e8f9" }} />
                  +91 9717017909
                </a>
              </li>
              <li>
                <a
                  href="mailto:angelmishraofficial@gmail.com"
                  className="flex items-center gap-2 hover:text-cyan-200 transition-colors break-all"
                >
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: "#67e8f9" }} />
                  angelmishraofficial@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/60 text-[12px]">
        <p>© {new Date().getFullYear()} Hire Via. All Rights Reserved.</p>
        <p className="flex items-center gap-4">
          <span>Official Portal</span>
          <span>•</span>
          <span>Delhi, India</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
