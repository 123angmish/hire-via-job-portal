import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";

const signupSchema = Yup.object().shape({
  fullName: Yup.string().trim().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Mobile number is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password required"),
  role: Yup.string().oneOf(["CANDIDATE", "EMPLOYER"]).required(),
});

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontSize: { xs: "13px", sm: "14px" },
    "& fieldset": { borderColor: "#e8e8e8" },
    "&:hover fieldset": { borderColor: "#1a6079" },
    "&.Mui-focused fieldset": { borderColor: "#1a6079" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a6079" },
  "& .MuiInputLabel-root": { fontSize: { xs: "12px", sm: "13px" } },
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "CANDIDATE",
      location: "",
      skills: [],
      resume: "",
      company: {
        name: "",
        websiteUrl: "",
        industry: "",
      },
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const payload = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          role: values.role,
          ...(values.role === "CANDIDATE" && {
            resume: values.resume || (resumeFile ? resumeFile.name : ""),
            skills: values.skills,
            location: values.location,
          }),
          ...(values.role === "EMPLOYER" && {
            company: {
              name: values.company.name,
              websiteUrl: values.company.websiteUrl || null,
              industry: values.company.industry,
            },
          }),
        };

        const { data } = await axios.post(
          "http://localhost:8081/auth/signup",
          payload
        );

        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("role", data.role);

        navigate(data.role === "EMPLOYER" ? "/employer/company-profile" : "/");
      } catch (error) {
        const msg = error.response?.data?.message || "Registration failed. Try again.";
        setFieldError("email", msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Skills
  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !formik.values.skills.includes(val)) {
      formik.setFieldValue("skills", [...formik.values.skills, val]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) =>
    formik.setFieldValue("skills", formik.values.skills.filter((s) => s !== skill));

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      formik.setFieldError("resume", "Only PDF allowed");
      return;
    }

    setResumeFile(file);
    setUploadingResume(true);

    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        formik.setFieldValue("resume", url);
      } else {
        formik.setFieldValue("resume", file.name);
      }
    } catch (err) {
      formik.setFieldValue("resume", file.name);
    } finally {
      setUploadingResume(false);
    }
  };

  const isCandidate = formik.values.role === "CANDIDATE";

  return (
    <div className="min-h-screen bg-[#f0f7fa] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_40px_rgba(26,96,121,0.10)] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a6079] via-[#2d8aac] to-[#1a6079]" />

        <div className="px-7 sm:px-10 py-8 sm:py-10">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1a1a1a] tracking-tight">
              Create your account
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#9a9a9a] mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1a6079] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="flex bg-[#f4f6f8] rounded-xl p-1 mb-7 gap-1">
            {["CANDIDATE", "EMPLOYER"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => formik.setFieldValue("role", r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold
                  transition-all duration-200 cursor-pointer
                  ${
                    formik.values.role === r
                      ? "bg-white text-[#1a6079] shadow-sm"
                      : "text-[#9a9a9a] hover:text-[#555]"
                  }`}
              >
                {r === "CANDIDATE" ? (
                  <PersonOutlineIcon sx={{ fontSize: 17 }} />
                ) : (
                  <BadgeOutlinedIcon sx={{ fontSize: 17 }} />
                )}
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                variant="outlined"
                sx={inputSx}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  sx={inputSx}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="phoneNumber"
                  variant="outlined"
                  sx={inputSx}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  sx={inputSx}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon
                              sx={{ fontSize: 18, color: "#9a9a9a" }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{ fontSize: 18, color: "#9a9a9a" }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  variant="outlined"
                  sx={inputSx}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? (
                            <VisibilityOffOutlinedIcon
                              sx={{ fontSize: 18, color: "#9a9a9a" }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{ fontSize: 18, color: "#9a9a9a" }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {isCandidate && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf"
                        hidden
                        onChange={handleResumeChange}
                      />
                      <TextField
                        fullWidth
                        label="Resume (PDF)"
                        value={
                          resumeFile ? resumeFile.name : formik.values.resume || ""
                        }
                        placeholder="Upload your resume"
                        sx={inputSx}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <label htmlFor="resume">
                                <Button
                                  component="span"
                                  size="small"
                                  disabled={uploadingResume}
                                  sx={{
                                    textTransform: "capitalize",
                                    color: "#1a6079",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    minWidth: "auto",
                                  }}
                                >
                                  {uploadingResume
                                    ? "Uploading..."
                                    : resumeFile
                                    ? "Change"
                                    : "Browse"}
                                </Button>
                              </label>
                            </InputAdornment>
                          ),
                        }}
                        error={
                          formik.touched.resume && Boolean(formik.errors.resume)
                        }
                        helperText={
                          (formik.touched.resume && formik.errors.resume) ||
                          (uploadingResume
                            ? "Uploading PDF..."
                            : resumeFile
                            ? `Selected: ${resumeFile.name}`
                            : "")
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        variant="outlined"
                        sx={inputSx}
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.location && Boolean(formik.errors.location)
                        }
                        helperText={
                          formik.touched.location && formik.errors.location
                        }
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="relative">
                      <TextField
                        fullWidth
                        label="Add Skills"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSkill())
                        }
                        sx={inputSx}
                        error={
                          formik.touched.skills && Boolean(formik.errors.skills)
                        }
                        helperText={
                          formik.touched.skills && formik.errors.skills
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={addSkill}
                                size="small"
                                sx={{
                                  textTransform: "capitalize",
                                  color: "#1a6079",
                                  fontSize: "12px",
                                  minWidth: "auto",
                                }}
                              >
                                Add
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>

                    {formik.values.skills.length > 0 && (
                      <ul className="mt-3 flex gap-2 flex-wrap">
                        {formik.values.skills.map((skill) => (
                          <li
                            key={skill}
                            className="flex items-center gap-1.5 text-[11px] lg:text-[13px] text-[#1a6079]
                              bg-[#1a6079]/8 font-medium py-1 pl-3 pr-2 rounded-lg border border-[#1a6079]/15"
                          >
                            {skill}
                            <ClearIcon
                              onClick={() => removeSkill(skill)}
                              sx={{ cursor: "pointer", fontSize: 14, color: "#1a6079" }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {!isCandidate && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="company.name"
                      variant="outlined"
                      sx={inputSx}
                      value={formik.values.company.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.company?.name &&
                        Boolean(formik.errors.company?.name)
                      }
                      helperText={
                        formik.touched.company?.name && formik.errors.company?.name
                      }
                    />
                    <TextField
                      fullWidth
                      label="Company Website (optional)"
                      name="company.websiteUrl"
                      variant="outlined"
                      sx={inputSx}
                      value={formik.values.company.websiteUrl}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.company?.websiteUrl &&
                        Boolean(formik.errors.company?.websiteUrl)
                      }
                      helperText={
                        formik.touched.company?.websiteUrl &&
                        formik.errors.company?.websiteUrl
                      }
                    />
                  </div>

                  <TextField
                    select
                    fullWidth
                    label="Industry"
                    name="company.industry"
                    variant="outlined"
                    sx={inputSx}
                    value={formik.values.company.industry}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.company?.industry &&
                      Boolean(formik.errors.company?.industry)
                    }
                    helperText={
                      formik.touched.company?.industry &&
                      formik.errors.company?.industry
                    }
                  >
                    <MenuItem value="">Select Industry</MenuItem>
                    <MenuItem value="IT">IT / Software</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Retail">Retail</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={formik.isSubmitting}
                sx={{
                  mt: 1,
                  background: "#1a6079",
                  textTransform: "capitalize",
                  py: { xs: 1.3, sm: 1.5 },
                  fontSize: { xs: 13, sm: 15 },
                  fontWeight: 600,
                  borderRadius: "12px",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#154f63",
                    boxShadow: "0 4px 16px rgba(26,96,121,0.3)",
                  },
                }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  `Create ${isCandidate ? "Candidate" : "Employer"} Account`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;