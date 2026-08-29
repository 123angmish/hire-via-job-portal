import React, { useEffect, useState } from "react";
import userImage from "../../../../assets/user.png";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, editProfile } from "../../../../store/candidate/userSlice";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(
    !!location.state?.updated
  );

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(fetchUserProfile());
    }

    if (location.state?.updated) {
      setShowSuccessToast(true);
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [dispatch, location.state]);

  const handleQuickResumeUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are allowed for resume!");
      return;
    }

    setUploadingResume(true);
    try {
      let resumeUrl = file.name;
      const cloudUrl = await uploadToCloudinary(file);
      if (cloudUrl) {
        resumeUrl = cloudUrl;
      }

      await dispatch(
        editProfile({
          fullName: user?.fullName,
          phoneNumber: user?.phoneNumber,
          location: user?.location || "",
          experience: user?.experience || "",
          skills: user?.skills || [],
          bio: user?.bio || "",
          profilePicture: user?.profilePicture || "",
          resume: resumeUrl,
        })
      );
      await dispatch(fetchUserProfile());
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <section className="lg:px-8 px-4 pb-12">
      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 24 }} />
          <div>
            <p className="font-bold text-[14px]">Profile Saved Successfully!</p>
            <p className="text-[12px] text-emerald-700">
              Your candidate profile and personal details have been updated.
            </p>
          </div>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-8 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-[#1a6079]/10 to-[#0284c7]/10 border-2 border-[#1a6079]/20 shadow-xs overflow-hidden flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                src={user?.profilePicture || userImage}
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = userImage;
                }}
              />
            </div>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#1a6079]/10 text-[#1a6079] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                Candidate Account
              </div>
              <h2 className="text-[22px] lg:text-[24px] font-extrabold text-slate-900">
                {user?.fullName || "Candidate"}
              </h2>
              <p className="text-[13px] text-slate-500 font-medium">
                {user?.email || "Candidate"}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/profile/edit")}
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "capitalize",
              color: "#1a6079",
              borderColor: "rgba(26,96,121,0.4)",
              borderRadius: "12px",
              px: 3,
              py: 0.9,
              fontWeight: 700,
              fontSize: "13px",
              "&:hover": { background: "rgba(26,96,121,0.06)", borderColor: "#1a6079" },
            }}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* ── DEDICATED RESUME & AI MATCH SECTION ── */}
      <div className="border border-[#1a6079]/25 bg-gradient-to-r from-[#f0f7fa] via-white to-[#f0f9ff] p-6 lg:p-7 rounded-3xl shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center">
                <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
              <h3 className="font-bold text-[17px] text-slate-900">
                Resume & AI Recommendations
              </h3>
            </div>
            <p className="text-slate-600 text-[13px] leading-relaxed">
              Your uploaded resume is indexed to match job opportunities. You can change your resume anytime to refresh recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {user?.resume && (
              <a
                href={user.resume}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-[#1a6079] hover:border-[#1a6079] rounded-xl text-[13px] font-bold transition-all shadow-2xs"
              >
                View PDF
              </a>
            )}

            <label>
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleQuickResumeUpdate}
              />
              <Button
                component="span"
                variant="contained"
                disabled={uploadingResume}
                startIcon={<FileUploadOutlinedIcon />}
                sx={{
                  background: "#1a6079",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  px: 3,
                  py: 1,
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(26,96,121,0.25)",
                  "&:hover": { background: "#124557" },
                }}
              >
                {uploadingResume ? "Updating..." : user?.resume ? "Change Resume" : "Upload Resume"}
              </Button>
            </label>

            <Button
              variant="outlined"
              onClick={() => navigate("/profile/recommended-jobs")}
              startIcon={<AutoAwesomeOutlinedIcon sx={{ color: "#1a6079" }} />}
              sx={{
                color: "#1a6079",
                borderColor: "#1a6079",
                textTransform: "capitalize",
                borderRadius: "12px",
                px: 3,
                py: 0.9,
                fontSize: "13px",
                fontWeight: 700,
                "&:hover": { background: "rgba(26,96,121,0.06)" },
              }}
            >
              AI Matches
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Info Grid */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-7 shadow-xs mb-6">
        <h3 className="font-bold text-[16px] text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Full Name
            </span>
            <p className="text-[14px] font-bold text-slate-800 mt-1">
              {user?.fullName || "—"}
            </p>
          </div>

          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </span>
            <p className="text-[14px] font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <EmailOutlinedIcon sx={{ fontSize: 16, color: "#1a6079" }} />
              {user?.email || "—"}
            </p>
          </div>

          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Phone Number
            </span>
            <p className="text-[14px] font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <PhoneOutlinedIcon sx={{ fontSize: 16, color: "#1a6079" }} />
              {user?.phoneNumber ? (user.phoneNumber.startsWith("+") ? user.phoneNumber : `+91 ${user.phoneNumber}`) : "—"}
            </p>
          </div>

          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Location
            </span>
            <p className="text-[14px] font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <LocationOnOutlinedIcon sx={{ fontSize: 16, color: "#1a6079" }} />
              {user?.location || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-7 shadow-xs mb-6">
        <h3 className="font-bold text-[16px] text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Professional Skills
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {user?.skills && user?.skills.length > 0 ? (
            user?.skills?.map((s) => (
              <span
                key={s}
                className="text-[#1a6079] bg-[#1a6079]/8 border border-[#1a6079]/20 font-bold text-[13px] py-1.5 px-4 rounded-xl"
              >
                {s}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-[13px]">
              No skills added yet. Update profile to add key skills.
            </span>
          )}
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-7 shadow-xs">
        <h3 className="font-bold text-[16px] text-slate-900 mb-3 pb-3 border-b border-slate-100">
          About & Bio
        </h3>
        <p className="text-slate-600 text-[14px] leading-relaxed">
          {user?.bio || (
            <span className="text-slate-400 italic">
              No professional summary added yet. Click 'Edit Profile' to add a summary.
            </span>
          )}
        </p>
      </div>
    </section>
  );
};

export default Profile;
