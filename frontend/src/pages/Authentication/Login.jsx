import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch } from "react-redux";
import { setAuthenticated, setJwt } from "../../store/candidate/authSlice";
import { fetchUserProfile } from "../../store/candidate/userSlice";
import { fetchEmployerProfile } from "../../store/employer/employerSlice";
import { clearJobErrors } from "../../store/employer/employerJobSlice";

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters required")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const roleParam = queryParams.get("role");
  const [selectedRole, setSelectedRole] = useState(
    roleParam?.toUpperCase() === "EMPLOYER" ? "EMPLOYER" : "CANDIDATE"
  );

  useEffect(() => {
    if (roleParam) {
      setSelectedRole(roleParam.toUpperCase() === "EMPLOYER" ? "EMPLOYER" : "CANDIDATE");
    }
  }, [roleParam]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const payload = {
          email: values.email.trim(),
          password: values.password,
          role: selectedRole,
        };

        const { data } = await axios.post(
          "http://localhost:8081/auth/login",
          payload
        );

        dispatch(setAuthenticated(true));
        dispatch(setJwt(data.jwt));
        dispatch(clearJobErrors());

        localStorage.setItem("jwt", data.jwt);

        const effectiveRole = selectedRole || data.role;
        localStorage.setItem("role", effectiveRole);

        if (effectiveRole === "EMPLOYER") {
          dispatch(fetchEmployerProfile());
          navigate("/employer/manage-jobs");
        } else {
          dispatch(fetchUserProfile());
          navigate("/jobs");
        }
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data ||
          "Invalid email or password";
        setErrorMessage(
          typeof msg === "string"
            ? msg
            : "Login failed. Please check your credentials."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const isCandidate = selectedRole === "CANDIDATE";

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#f0f7fa]/80 via-[#f4f9fb] to-[#f8fafc]">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_16px_50px_rgba(26,96,121,0.09)]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mx-auto mb-3 shadow-inner">
            {isCandidate ? (
              <PersonOutlineIcon sx={{ fontSize: 30 }} />
            ) : (
              <BusinessOutlinedIcon sx={{ fontSize: 30 }} />
            )}
          </div>
          <h1 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900 tracking-tight">
            {isCandidate ? "Candidate Sign In" : "Employer Sign In"}
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            {isCandidate
              ? "Browse job openings, track ATS decisions & chat with recruiters"
              : "Post job openings, review applicants & schedule interviews"}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 gap-1.5 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setSelectedRole("CANDIDATE")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              isCandidate
                ? "bg-[#1a6079] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PersonOutlineIcon sx={{ fontSize: 18 }} />
            Candidate
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("EMPLOYER")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              !isCandidate
                ? "bg-[#1a6079] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BusinessOutlinedIcon sx={{ fontSize: 18 }} />
            Employer
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[13px] font-medium animate-fade-in">
            {errorMessage}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              {isCandidate ? "Candidate Email Address" : "Employer Work Email"}
            </label>
            <input
              type="email"
              name="email"
              placeholder={
                isCandidate
                  ? "candidate@example.com"
                  : "employer@company.com"
              }
              className={`w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all ${
                formik.touched.email && formik.errors.email
                  ? "border-rose-300 bg-rose-50/30"
                  : "border-slate-200 bg-slate-50/50 focus:border-[#1a6079] focus:bg-white focus:ring-2 focus:ring-[#1a6079]/10"
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-rose-500 text-[12px] mt-1 font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[13px] font-semibold text-slate-700">
                Password
              </label>
              <span className="text-[#1a6079] text-[12px] font-semibold hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all ${
                formik.touched.password && formik.errors.password
                  ? "border-rose-300 bg-rose-50/30"
                  : "border-slate-200 bg-slate-50/50 focus:border-[#1a6079] focus:bg-white focus:ring-2 focus:ring-[#1a6079]/10"
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-rose-500 text-[12px] mt-1 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{
                background: "#1a6079",
                textTransform: "capitalize",
                height: "48px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
                "&:hover": { background: "#124557" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                `Sign In as ${isCandidate ? "Candidate" : "Employer"}`
              )}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-[13px] text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#1a6079] font-bold hover:underline"
              >
                Register as {isCandidate ? "Candidate" : "Employer"}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
