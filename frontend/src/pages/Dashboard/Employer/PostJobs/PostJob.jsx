import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postJob, fetchJobs as fetchEmployerJobs, clearJobErrors } from "../../../../store/employer/employerJobSlice";
import { fetchJobs as fetchCandidateJobs } from "../../../../store/candidate/jobSlice";
import { fetchCategories } from "../../../../store/candidate/categorySlice";
import { fetchEmployerProfile } from "../../../../store/employer/employerSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Technology & Engineering" },
  { id: 2, name: "Product & Project Management" },
  { id: 3, name: "Design & Creative" },
  { id: 4, name: "Data Science & AI" },
  { id: 5, name: "Sales & Marketing" },
  { id: 6, name: "Finance & Accounting" },
  { id: 7, name: "HR & Operations" },
  { id: 8, name: "Customer Success & Support" },
];

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employer } = useSelector((state) => state.employer);
  const { categories } = useSelector((state) => state.category);
  const { createJobLoading, createJobError } = useSelector((state) => state.employerJob);
  const [postSuccessMsg, setPostSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(clearJobErrors());
    dispatch(fetchCategories());
    dispatch(fetchEmployerProfile());
  }, [dispatch]);

  const categoryList = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      categoryId: 1,
      requiredExperience: "1-3 years",
      avgSalary: "6-12 LPA",
      timing: "FULL_TIME",
      responsibilities: [],
      responsibilityInput: "",
      requiredSkills: [],
      skillInput: "",
    },

    enableReinitialize: false,

    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .min(3, "Job title must be at least 3 characters")
        .max(150, "Job title cannot exceed 150 characters")
        .required("Job title is required"),

      description: Yup.string()
        .trim()
        .min(10, "Job description must be at least 10 characters")
        .max(5000, "Job description cannot exceed 5000 characters")
        .required("Job description is required"),

      categoryId: Yup.mixed().required("Category is required"),
      requiredExperience: Yup.string().trim().required("Experience is required"),
      avgSalary: Yup.string().trim().required("Salary is required"),
      timing: Yup.string().required("Job type is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      // Collect any pending input
      let finalResponsibilities = [...values.responsibilities];
      if (values.responsibilityInput.trim()) {
        finalResponsibilities.push(values.responsibilityInput.trim());
      }
      if (finalResponsibilities.length === 0) {
        finalResponsibilities = [
          "Execute core engineering & development tasks",
          "Collaborate effectively across cross-functional teams",
        ];
      }

      let finalSkills = [...values.requiredSkills];
      if (values.skillInput.trim()) {
        finalSkills.push(values.skillInput.trim());
      }
      if (finalSkills.length === 0) {
        finalSkills = ["Problem Solving", "Communication", "Team Collaboration"];
      }

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        categoryId: Number(values.categoryId || 1),
        companyId: employer?.company?.id || 1,
        requiredExperience: values.requiredExperience.trim(),
        avgSalary: values.avgSalary.trim(),
        timing: values.timing,
        responsibilities: finalResponsibilities,
        requiredSkills: finalSkills,
      };

      const result = await dispatch(postJob(payload));
      if (result.meta.requestStatus === "fulfilled") {
        setPostSuccessMsg("Job opening published successfully!");
        await dispatch(fetchCandidateJobs());
        await dispatch(fetchEmployerJobs());
        resetForm();
        setTimeout(() => {
          navigate("/employer/manage-jobs");
        }, 1000);
      }
    },
  });

  const addResHandler = () => {
    const value = formik.values.responsibilityInput.trim();
    if (!value) return;
    if (!formik.values.responsibilities.includes(value)) {
      formik.setFieldValue("responsibilities", [
        ...formik.values.responsibilities,
        value,
      ]);
    }
    formik.setFieldValue("responsibilityInput", "");
  };

  const removeResHandler = (idx) => {
    const updated = formik.values.responsibilities.filter((_, i) => i !== idx);
    formik.setFieldValue("responsibilities", updated);
  };

  const addSkillHandler = () => {
    const value = formik.values.skillInput.trim();
    if (!value) return;
    if (!formik.values.requiredSkills.includes(value)) {
      formik.setFieldValue("requiredSkills", [
        ...formik.values.requiredSkills,
        value,
      ]);
    }
    formik.setFieldValue("skillInput", "");
  };

  const removeSkillHandler = (idx) => {
    const updated = formik.values.requiredSkills.filter((_, i) => i !== idx);
    formik.setFieldValue("requiredSkills", updated);
  };

  return (
    <section className="px-4 sm:px-6 md:px-10 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-[20px] lg:text-[24px] font-extrabold text-slate-900">
            Post a New Job
          </h2>
          <p className="text-[13px] text-slate-500 font-medium">
            Publish high-reach job openings and receive verified applications instantly.
          </p>
        </div>
      </div>

      {postSuccessMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "14px" }}>
          🎉 {postSuccessMsg} Redirecting to your active listings...
        </Alert>
      )}

      {createJobError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>
          {typeof createJobError === "string"
            ? createJobError
            : "Failed to post job. Please check all fields and try again."}
        </Alert>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <form onSubmit={formik.handleSubmit}>
          {/* Job Title & Description */}
          <div className="flex flex-col md:flex-row gap-6">
            <TextField
              fullWidth
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              label="Job Title *"
              placeholder="e.g. Senior Full Stack Developer"
              variant="outlined"
            />

            <TextField
              fullWidth
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              label="Job Description *"
              placeholder="Detailed description of the role, expectations & deliverables..."
              variant="outlined"
            />
          </div>

          {/* Category & Timing */}
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <FormControl
              fullWidth
              error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
            >
              <InputLabel id="category-select-label">Job Category *</InputLabel>
              <Select
                labelId="category-select-label"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Job Category *"
              >
                {categoryList.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="timing-select-label">Job Type *</InputLabel>
              <Select
                labelId="timing-select-label"
                name="timing"
                value={formik.values.timing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Job Type *"
              >
                <MenuItem value={"FULL_TIME"}>Full Time</MenuItem>
                <MenuItem value={"PART_TIME"}>Part Time</MenuItem>
                <MenuItem value={"INTERNSHIP"}>Internship</MenuItem>
                <MenuItem value={"CONTRACT"}>Contract</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Experience & Salary */}
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <TextField
              fullWidth
              name="requiredExperience"
              value={formik.values.requiredExperience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.requiredExperience &&
                Boolean(formik.errors.requiredExperience)
              }
              helperText={
                formik.touched.requiredExperience &&
                formik.errors.requiredExperience
              }
              label="Experience Required *"
              placeholder="e.g. 1-3 years / Fresher"
              variant="outlined"
            />

            <TextField
              fullWidth
              name="avgSalary"
              value={formik.values.avgSalary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.avgSalary && Boolean(formik.errors.avgSalary)}
              helperText={formik.touched.avgSalary && formik.errors.avgSalary}
              label="Compensation / Average Salary *"
              placeholder="e.g. 8-14 LPA"
              variant="outlined"
            />
          </div>

          {/* Key Responsibilities */}
          <div className="mt-6">
            <div className="relative">
              <TextField
                fullWidth
                name="responsibilityInput"
                label="Key Responsibilities"
                placeholder="Type a responsibility and press Enter or click Add"
                variant="outlined"
                value={formik.values.responsibilityInput}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addResHandler();
                  }
                }}
              />

              <Button
                type="button"
                onClick={addResHandler}
                sx={{
                  textTransform: "capitalize",
                  position: "absolute",
                  right: 8,
                  top: 8,
                  fontWeight: 700,
                  color: "#1a6079",
                }}
              >
                Add
              </Button>
            </div>

            <ul className="mt-3 flex gap-2 flex-wrap min-h-[32px]">
              {formik.values.responsibilities?.map((elem, idx) => (
                <li
                  key={idx}
                  className="text-[12px] lg:text-[13px] relative text-[#1a6079] bg-[#1a6079]/10 border border-[#1a6079]/20 font-semibold py-1.5 pl-3.5 pr-8 rounded-xl flex items-center"
                >
                  <span>{elem}</span>
                  <ClearIcon
                    onClick={() => removeResHandler(idx)}
                    sx={{
                      cursor: "pointer",
                      fontSize: 15,
                      color: "#1a6079",
                      position: "absolute",
                      right: 8,
                      "&:hover": { color: "#ef4444" },
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div className="mt-6">
            <div className="relative">
              <TextField
                fullWidth
                name="skillInput"
                label="Required Skills"
                placeholder="Type a skill (e.g. Java, React, SQL) and press Enter or click Add"
                variant="outlined"
                value={formik.values.skillInput}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkillHandler();
                  }
                }}
              />

              <Button
                type="button"
                onClick={addSkillHandler}
                sx={{
                  textTransform: "capitalize",
                  position: "absolute",
                  right: 8,
                  top: 8,
                  fontWeight: 700,
                  color: "#1a6079",
                }}
              >
                Add
              </Button>
            </div>

            <ul className="mt-3 flex gap-2 flex-wrap min-h-[32px]">
              {formik.values.requiredSkills?.map((elem, idx) => (
                <li
                  key={idx}
                  className="text-[12px] lg:text-[13px] relative text-[#1a6079] bg-[#1a6079]/10 border border-[#1a6079]/20 font-semibold py-1.5 pl-3.5 pr-8 rounded-xl flex items-center"
                >
                  <span>{elem}</span>
                  <ClearIcon
                    onClick={() => removeSkillHandler(idx)}
                    sx={{
                      cursor: "pointer",
                      fontSize: 15,
                      color: "#1a6079",
                      position: "absolute",
                      right: 8,
                      "&:hover": { color: "#ef4444" },
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={createJobLoading}
              sx={{
                background: "#1a6079",
                textTransform: "capitalize",
                py: 1.6,
                fontSize: { xs: 14, sm: 16 },
                fontWeight: 700,
                borderRadius: "14px",
                boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
                "&:hover": { background: "#124557" },
              }}
            >
              {createJobLoading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <span>Publishing Job Listing...</span>
                </div>
              ) : (
                "Post Job Now"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PostJob;
