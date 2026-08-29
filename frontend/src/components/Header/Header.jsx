import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallIcon from "@mui/icons-material/Call";
import SortIcon from "@mui/icons-material/Sort";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { searchJobs } from "../../store/candidate/jobSlice";
import { logout } from "../../store/candidate/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("jwt"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("jwt"));
    setOpenMenu(false);
  }, [location.pathname]);

  const getUserRole = () => {
    let role = localStorage.getItem("role");
    if (!role) {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const authorities = payload.authorities || "";
          if (authorities.includes("EMPLOYER")) role = "EMPLOYER";
          else if (authorities.includes("CANDIDATE")) role = "CANDIDATE";
        } catch (e) {
          // ignore
        }
      }
    }
    return role;
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    dispatch(searchJobs({ keyword: trimmed, location: "" }));
    navigate(`/jobs?search=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleProfileClick = () => {
    const role = getUserRole();
    navigate(role === "EMPLOYER" ? "/employer/company-profile" : "/profile");
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  const getNavLinks = () => {
    const role = getUserRole();

    if (!isLoggedIn) {
      return [
        { label: "Home", to: "/" },
        { label: "Find Jobs", to: "/jobs" },
      ];
    }

    if (role === "EMPLOYER") {
      return [
        { label: "Home", to: "/" },
        { label: "Post Job", to: "/employer/post-job" },
        { label: "Manage Jobs", to: "/employer/manage-jobs" },
        { label: "Applicants", to: "/employer/view-applicants" },
        { label: "Company", to: "/employer/company-profile" },
      ];
    }

    return [
      { label: "Home", to: "/" },
      { label: "Find Jobs", to: "/jobs" },
      { label: "Applied", to: "/profile/applied-jobs" },
      { label: "Saved", to: "/profile/saved-jobs" },
      { label: "AI Matches", to: "/profile/recommended-jobs" },
      { label: "Profile", to: "/profile" },
    ];
  };

  const role = getUserRole();

  const AuthButton = ({ fullWidth = false }) =>
    isLoggedIn ? (
      <div className="flex items-center gap-3">
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#1a6079]/8 hover:bg-[#1a6079]/15 border border-[#1a6079]/20 transition-all cursor-pointer text-[#1a6079]"
        >
          <AccountCircleIcon sx={{ fontSize: 22 }} />
          <span className="text-[13px] font-semibold">
            {role === "EMPLOYER" ? "Employer Portal" : "Candidate Portal"}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-[13px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
          Logout
        </button>
      </div>
    ) : (
      <div className={`flex items-center gap-2.5 ${fullWidth ? "flex-col w-full" : ""}`}>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          fullWidth={fullWidth}
          sx={{
            textTransform: "capitalize",
            px: 3,
            py: 0.85,
            background: "#1a6079",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(26,96,121,0.25)",
            fontSize: "13px",
            fontWeight: 700,
            "&:hover": { background: "#124557" },
          }}
        >
          Sign In
        </Button>
      </div>
    );

  return (
    <>
      <header className="glass-header px-6 lg:px-12 py-3.5 flex justify-between items-center sticky top-0 z-40 transition-all">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="logo font-bold text-[20px] lg:text-[22px] text-[#1a6079] tracking-tight group-hover:opacity-90 transition-opacity">
              Hire Via
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider text-[#1a6079] bg-[#1a6079]/10 px-2 py-0.5 rounded-full uppercase">
              Pro
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium">
            {getNavLinks().map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition-all py-1 font-semibold ${
                    isActive
                      ? "text-[#1a6079] border-b-2 border-[#1a6079]"
                      : "text-slate-600 hover:text-[#1a6079]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <div className="hidden xl:block ml-2">
            <div className="relative w-72">
              <input
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#1a6079]/50 focus:bg-white pl-4 pr-9 py-2 rounded-full text-[13px] placeholder:text-slate-400 text-slate-800 outline-none transition-all focus:ring-2 focus:ring-[#1a6079]/10"
                placeholder="Search jobs, skills, roles..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="top-1/2 -translate-y-1/2 right-1.5 absolute bg-[#1a6079] h-6.5 w-6.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#124557] transition-colors"
              >
                <SearchIcon sx={{ fontSize: 15, color: "white" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop right — Auth or Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <AuthButton />
          </div>

          <IconButton
            sx={{ color: "#1e293b", display: { lg: "none" } }}
            onClick={() => setOpenMenu(true)}
          >
            <SortIcon />
          </IconButton>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden flex justify-end animate-fade-in"
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="w-[80vw] sm:w-[360px] h-full bg-white p-6 flex flex-col justify-between shadow-2xl animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="logo font-bold text-[20px] text-[#1a6079]">
                  Hire Via
                </span>
                <IconButton onClick={() => setOpenMenu(false)} size="small">
                  <CloseIcon sx={{ color: "#64748b" }} />
                </IconButton>
              </div>

              {/* Mobile Search */}
              <div className="mt-4 mb-6">
                <div className="relative">
                  <input
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-[13px] placeholder:text-slate-400 outline-none"
                    placeholder="Search jobs, skills..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setOpenMenu(false);
                        handleSearch();
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      handleSearch();
                    }}
                    className="top-1/2 -translate-y-1/2 right-2 absolute bg-[#1a6079] p-1.5 rounded-lg flex items-center justify-center text-white"
                  >
                    <SearchIcon sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>

              <nav className="flex flex-col gap-3 text-[14px] font-medium">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpenMenu(false)}
                    className={`py-2 px-3 rounded-xl transition-all font-semibold ${
                      location.pathname === link.to
                        ? "bg-[#1a6079]/10 text-[#1a6079]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <a
                  href="tel:+919717017909"
                  className="text-[13px] font-medium text-slate-600 flex items-center gap-2 mt-4 px-3 py-2 bg-slate-50 rounded-xl"
                >
                  <CallIcon sx={{ fontSize: 16, color: "#1a6079" }} />
                  +91 9717017909
                </a>
              </nav>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <AuthButton fullWidth />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;