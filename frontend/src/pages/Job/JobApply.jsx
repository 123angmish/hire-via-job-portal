import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";
import { useDispatch, useSelector } from "react-redux";
import { applyJob, fetchApplications, clearApplyJobError } from "../../store/candidate/applicationSlice";
import { fetchUserProfile } from "../../store/candidate/userSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { clearJobDetails, fetchJobDetails } from "../../store/candidate/jobSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

const applySchema = Yup.object({
  coverLetter: Yup.string()
    .trim()
    .min(5, "Cover letter should be at least 5 characters")
    .required("Cover letter is required"),
  resumeUrl: Yup.mixed(),
});

const JobApply = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { jobDetails } = useSelector((state) => state.job);
  const { user } = useSelector((state) => state.user);
  const { applyJobLoading, applyJobError } = useSelector((state) => state.application);

  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("jwt");
  const isLoggedIn = !!token;

  useEffect(() => {
    dispatch(clearApplyJobError());
    if (id) {
      dispatch(fetchJobDetails(id));
    }
    if (token) {
      dispatch(fetchUserProfile());
    }

    return () => {
      dispatch(clearJobDetails());
      dispatch(clearApplyJobError());
    };
  }, [dispatch, id, token]);

  const formik = useFormik({
    initialValues: {
      resumeUrl: user?.resume || "",
      coverLetter: "",
    },
    enableReinitialize: true,
    validationSchema: applySchema,
    onSubmit: async (values) => {
      if (!localStorage.getItem("jwt")) {
        navigate("/login");
        return;
      }

      dispatch(clearApplyJobError());
      const finalResume = values.resumeUrl || user?.resume || selectedFileName || "Candidate_Resume.pdf";
      const finalCoverLetter = values.coverLetter?.trim() || `Application for ${jobDetails?.title || "Position"}`;

      const payload = {
        coverLetter: finalCoverLetter,
        resumeUrl: finalResume,
        id: Number(id),
      };

      const res = await dispatch(applyJob(payload));
      if (res.meta.requestStatus === "fulfilled") {
        setSuccessMsg("Application submitted successfully!");
        dispatch(fetchApplications());
        setTimeout(() => {
          navigate("/profile/applied-jobs");
        }, 1200);
      }
    },
  });

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      formik.setFieldError("resumeUrl", "Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      formik.setFieldError("resumeUrl", "File size cannot exceed 10MB");
      return;
    }

    setSelectedFileName(file.name);
    setUploading(true);

    // Read local file as Data URL immediately as fallback
    const reader = new FileReader();
    reader.onload = () => {
      formik.setFieldValue("resumeUrl", reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        formik.setFieldValue("resumeUrl", url);
      }
    } catch (err) {
      console.warn("Cloudinary upload fallback to local file data", err);
    } finally {
      setUploading(false);
    }
  };

  const companyInitial = jobDetails?.company?.name
    ? jobDetails.company.name.charAt(0).toUpperCase()
    : "J";

  return (
    <section className="lg:px-12 px-6 pt-6 pb-12 max-w-3xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a6079] to-[#0284c7] text-white flex justify-center items-center font-bold text-xl overflow-hidden shrink-0 shadow-xs">
            {jobDetails?.company?.logoUrl ? (
              <img
                src={jobDetails.company.logoUrl}
                className="w-full h-full object-contain p-2 bg-white"
                alt="Company Logo"
              />
            ) : (
              companyInitial
            )}
          </div>

          <div>
            <h2 className="text-[18px] sm:text-[22px] font-bold text-slate-900 leading-snug">
              Apply for {jobDetails?.title || "Job Position"}
            </h2>
            <p className="text-[13px] text-slate-500 font-medium">
              {jobDetails?.company?.name || "Company"} {jobDetails?.company?.location ? `• ${jobDetails.company.location}` : ""}
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon />}
            sx={{
              mt: 4,
              borderRadius: "14px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {successMsg} Redirecting to your applied jobs...
          </Alert>
        )}

        {/* Apply Job Error Alert */}
        {applyJobError && (
          <Alert
            severity="error"
            onClose={() => dispatch(clearApplyJobError())}
            sx={{
              mt: 4,
              borderRadius: "14px",
              fontWeight: 500,
              fontSize: "13px",
            }}
          >
            {typeof applyJobError === "string"
              ? applyJobError
              : applyJobError?.message || "Failed to submit application. Please check your details."}
          </Alert>
        )}

        {/* Not Logged In Banner */}
        {!isLoggedIn && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
              <LockOpenOutlinedIcon sx={{ fontSize: 20 }} />
              <span>You need to be logged in to apply for this position.</span>
            </div>
            <Link to="/login">
              <Button
                variant="contained"
                size="small"
                sx={{
                  background: "#1a6079",
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  "&:hover": { background: "#124557" },
                }}
              >
                Sign In
              </Button>
            </Link>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">
          {/* Candidate Profile Details (Auto-filled) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div>
              <p className="text-xs text-slate-400 font-medium">Applicant Name</p>
              <p className="text-sm font-bold text-slate-800">
                {user?.fullName || "Not Logged In"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">Applicant Email</p>
              <p className="text-sm font-bold text-slate-800">
                {user?.email || "—"}
              </p>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Resume (PDF Format) *
            </label>

            <div className="border-2 border-dashed border-slate-200 hover:border-[#1a6079]/50 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
              <input
                type="file"
                accept="application/pdf"
                id="resume-upload-input"
                onChange={handleResumeUpload}
                className="hidden"
              />

              <label
                htmlFor="resume-upload-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center">
                  <DescriptionOutlinedIcon sx={{ fontSize: 26 }} />
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {uploading ? (
                    <span className="flex items-center gap-2 text-[#1a6079] font-bold">
                      <CircularProgress size={14} sx={{ color: "#1a6079" }} />
                      Uploading resume...
                    </span>
                  ) : selectedFileName ? (
                    <span className="text-emerald-700 font-bold">
                      Selected: {selectedFileName}
                    </span>
                  ) : formik.values.resumeUrl ? (
                    <span className="text-emerald-700 font-bold">
                      Resume attached from profile
                    </span>
                  ) : (
                    <>
                      <span className="text-[#1a6079] font-bold underline">
                        Click to upload
                      </span>{" "}
                      or drag & drop your PDF resume
                    </>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">PDF up to 10MB</span>
              </label>
            </div>

            {formik.touched.resumeUrl && formik.errors.resumeUrl && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {formik.errors.resumeUrl}
              </p>
            )}
          </div>

          {/* Cover Letter Section */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Cover Letter / Note to Recruiter *
            </label>
            <TextField
              name="coverLetter"
              multiline
              rows={5}
              fullWidth
              placeholder="Explain why your experience, skills, and background make you a great fit for this role..."
              value={formik.values.coverLetter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.coverLetter && Boolean(formik.errors.coverLetter)
              }
              helperText={
                formik.touched.coverLetter && formik.errors.coverLetter
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  fontSize: "14px",
                  bgcolor: "#f8fafc",
                },
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={applyJobLoading || uploading}
              sx={{
                background: "#1a6079",
                borderRadius: "14px",
                py: 1.5,
                fontWeight: 700,
                fontSize: "15px",
                textTransform: "capitalize",
                boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
                "&:hover": { background: "#124557" },
              }}
            >
              {applyJobLoading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={18} sx={{ color: "white" }} />
                  <span>Submitting Application...</span>
                </div>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default JobApply;
