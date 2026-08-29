import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerProfile } from "../../../../store/employer/employerSlice";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showSuccessToast, setShowSuccessToast] = useState(
    !!location.state?.updated
  );

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    dispatch(fetchEmployerProfile());

    if (location.state?.updated) {
      setShowSuccessToast(true);
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
      // Clear history state
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [dispatch, location.state]);

  const { employer } = useSelector((state) => state.employer);
  const company = employer?.company;

  return (
    <section className="lg:px-10 px-4 lg:pb-8 pb-12.5">
      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 24 }} />
          <div>
            <p className="font-bold text-[14px]">Profile Saved Successfully!</p>
            <p className="text-[12px] text-emerald-700">
              Your company profile details have been updated and are now live.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full flex justify-center items-center bg-[#f0f9ff] border-2 border-[#1a6079]/30 shadow-md overflow-hidden">
          {company?.logoUrl ? (
            <img
              className="w-full h-full object-cover"
              src={company.logoUrl}
              alt={company?.name || "Company Logo"}
            />
          ) : (
            <ApartmentIcon sx={{ fontSize: { xs: 40, lg: 52 }, color: "#1a6079" }} />
          )}
        </div>
        <div>
          <h3 className="lg:text-[18px] text-[15px] font-bold text-slate-800">
            {company?.name || employer?.user?.fullName || "My Company"}
          </h3>
          <Button
            onClick={() => navigate("/employer/edit-company-profile")}
            variant="outlined"
            sx={{
              textTransform: "capitalize",
              color: "#1a6079",
              borderColor: "#1a6079",
              borderRadius: "8px",
              paddingX: { xs: "15px", md: "20px" },
              marginTop: "8px",
              paddingY: { xs: 0.5, md: 0.8 },
              "&:hover": { background: "#f0f9ff" },
            }}
          >
            <span className="font-semibold lg:text-[13px] text-[12px]">
              Edit Profile
            </span>
          </Button>
        </div>
      </div>

      <div className="border border-slate-200 bg-white lg:px-7 px-5 py-4 lg:py-5 mt-5 lg:mt-8 rounded-2xl shadow-xs">
        <h3 className="font-bold lg:text-[16px] text-[14px] text-slate-900 border-b border-slate-100 pb-3">
          Company Information
        </h3>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Industry
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.industry || "—"}
            </p>
          </div>

          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Company Size
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.size || "—"}
            </p>
          </div>

          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Established Year
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.foundedYear || "—"}
            </p>
          </div>

          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Website URL
            </h4>
            <p className="font-semibold mt-1 text-[13px] lg:text-[14px]">
              {company?.websiteUrl ? (
                <a
                  href={
                    company.websiteUrl.startsWith("http")
                      ? company.websiteUrl
                      : `https://${company.websiteUrl}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1a6079] hover:underline"
                >
                  {company.websiteUrl}
                </a>
              ) : (
                <span className="text-slate-400 font-normal">—</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 bg-white lg:px-7 px-5 py-4 lg:py-5 mt-5 rounded-2xl shadow-xs">
        <h3 className="font-bold lg:text-[16px] text-[14px] text-slate-900 border-b border-slate-100 pb-3">
          Contact Details
        </h3>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Owner Name
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.ownerName || employer?.user?.fullName || "—"}
            </p>
          </div>

          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Contact Email
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.ownerEmail || employer?.user?.email || "—"}
            </p>
          </div>

          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Phone Number
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.ownerPhoneNumber || employer?.user?.phoneNumber || "—"}
            </p>
          </div>

          <div>
            <h4 className="text-slate-400 font-semibold text-[12px] uppercase tracking-wider">
              Location
            </h4>
            <p className="font-semibold text-slate-800 mt-1 text-[13px] lg:text-[14px]">
              {company?.location || employer?.user?.location || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 bg-white lg:px-7 px-5 py-4 lg:py-5 mt-5 rounded-2xl shadow-xs">
        <h3 className="font-bold lg:text-[16px] text-[14px] text-slate-900 border-b border-slate-100 pb-3">
          About Company
        </h3>

        <div className="mt-3">
          <p className="font-normal text-slate-600 text-[13px] lg:text-[14px] leading-relaxed">
            {company?.description || (
              <span className="text-slate-400 italic">
                No company description added yet. Click "Edit Profile" above to describe your organization.
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
