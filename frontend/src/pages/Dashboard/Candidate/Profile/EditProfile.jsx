import React, { useState, useEffect } from "react";
import userImage from "../../../../assets/user.png";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { editProfile, fetchUserProfile } from "../../../../store/candidate/userSlice";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const EditProfileSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),

  phoneNumber: Yup.string().trim().nullable(),

  location: Yup.string().trim().nullable(),

  experience: Yup.string().trim().nullable(),

  skills: Yup.array().nullable(),

  resume: Yup.string().nullable(),

  profilePicture: Yup.string().nullable(),

  bio: Yup.string().trim().max(1000, "Bio must not exceed 1000 characters").nullable(),
});

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editProfileLoading, editProfileError, user } = useSelector((state) => state.user);

  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      experience: user?.experience || "",
      skills: user?.skills || [],
      resume: user?.resume || "",
      profilePicture: user?.profilePicture || "",
      bio: user?.bio || "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      const payload = {
        fullName: values.fullName?.trim() || "",
        phoneNumber: values.phoneNumber?.trim() || "",
        location: values.location?.trim() || "",
        experience: values.experience?.trim() || "",
        skills: values.skills || [],
        resume: values.resume || "",
        profilePicture: values.profilePicture || "",
        bio: values.bio?.trim() || "",
      };

      const res = await dispatch(editProfile(payload));
      if (editProfile.fulfilled.match(res)) {
        await dispatch(fetchUserProfile());
        navigate("/profile", { state: { updated: true } });
      }
    },
  });

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const trimmed = skillInput.trim();
    if (!formik.values.skills.includes(trimmed)) {
      formik.setFieldValue("skills", [...formik.values.skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (index) => {
    const updated = formik.values.skills.filter((_, i) => i !== index);
    formik.setFieldValue("skills", updated);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      formik.setFieldError("resume", "Only PDF files are allowed");
      return;
    }

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

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      formik.setFieldError("profilePicture", "Only image files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      formik.setFieldValue("profilePicture", reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        formik.setFieldValue("profilePicture", url);
      }
    } catch (err) {
      console.error("Cloudinary failed, keeping local preview", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="lg:px-10 px-4 pb-12">
      {editProfileError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: "14px" }}>
          {typeof editProfileError === "string"
            ? editProfileError
            : "Failed to update profile. Please try again."}
        </Alert>
      )}

      <div className="flex gap-4 items-center mb-8">
        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full flex justify-center relative items-center bg-[#f0f9ff] border-2 border-[#1a6079]/30 shadow-md overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={formik.values.profilePicture || userImage}
            alt="profile"
            onError={() => formik.setFieldValue("profilePicture", "")}
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-xs">
              <CircularProgress size={20} sx={{ color: "white", mb: 0.5 }} />
              <span>Uploading...</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="lg:text-[18px] text-[15px] font-semibold text-gray-800">
            {formik.values.fullName || "Your Name"}
          </h3>

          <label>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleProfilePicUpload}
            />
            <Button
              component="span"
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                color: "#1a6079",
                borderColor: "#1a6079",
                borderRadius: "8px",
                paddingX: { xs: "12px", md: "20px" },
                marginTop: "8px",
                paddingY: { xs: 0.5, md: 0.8 },
                "&:hover": { background: "#f0f9ff" },
              }}
            >
              <span className="font-medium lg:text-[13px] text-[12px]">
                {uploading ? "Uploading..." : "Change Photo"}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          <TextField
            fullWidth
            label="Full Name *"
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            placeholder="e.g. 9876543210"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <TextField
            fullWidth
            label="Location"
            name="location"
            placeholder="e.g. Delhi, India"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />

          <TextField
            fullWidth
            label="Experience"
            name="experience"
            placeholder="e.g. 2 Years / Fresher"
            value={formik.values.experience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experience && Boolean(formik.errors.experience)}
            helperText={formik.touched.experience && formik.errors.experience}
          />
        </div>

        {/* Skills */}
        <div className="mt-6">
          <div className="relative">
            <TextField
              fullWidth
              label="Add Skill (Press Enter or click Add)"
              placeholder="e.g. React, Java, Spring Boot, SQL"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button
              type="button"
              onClick={addSkill}
              sx={{
                position: "absolute",
                right: 6,
                top: 8,
                textTransform: "capitalize",
                color: "#1a6079",
                fontWeight: 700,
              }}
            >
              Add
            </Button>
          </div>

          <ul className="mt-4 flex gap-2 flex-wrap min-h-[32px]">
            {formik.values.skills.map((skill, index) => (
              <li
                key={index}
                className="text-[12px] lg:text-[13px] text-[#1a6079] bg-[#1a6079]/10 border border-[#1a6079]/20 font-semibold py-1 px-3.5 rounded-xl flex items-center gap-1.5"
              >
                {skill}
                <ClearIcon
                  onClick={() => removeSkill(index)}
                  sx={{
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#1a6079",
                    "&:hover": { color: "#ef4444" },
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <TextField
            fullWidth
            label="Resume (PDF)"
            value={formik.values.resume ? "PDF Resume Attached" : ""}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Button
                  component="label"
                  disabled={uploadingResume}
                  sx={{ textTransform: "capitalize", color: "#1a6079", fontWeight: 700 }}
                >
                  {uploadingResume ? "Uploading..." : "Upload PDF"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={handleResumeUpload}
                  />
                </Button>
              ),
            }}
          />

          {formik.values.resume && (
            <a
              href={formik.values.resume}
              target="_blank"
              rel="noreferrer"
              className="text-[#1a6079] font-semibold text-xs mt-2 inline-block hover:underline"
            >
              View Attached Resume
            </a>
          )}
        </div>

        {/* Bio */}
        <div className="mt-6">
          <TextField
            multiline
            rows={4}
            fullWidth
            label="About & Bio"
            name="bio"
            placeholder="Write a brief overview about your career goals, background, and expertise..."
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={
              (formik.touched.bio && formik.errors.bio) ||
              `${formik.values.bio?.length ?? 0}/1000 characters`
            }
          />
        </div>

        <div className="mt-8">
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={editProfileLoading || uploading}
            sx={{
              background: "#1a6079",
              textTransform: "capitalize",
              py: 1.5,
              fontSize: "15px",
              fontWeight: 700,
              borderRadius: "14px",
              boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
              "&:hover": { background: "#124557" },
            }}
          >
            {editProfileLoading ? (
              <div className="flex items-center gap-2">
                <CircularProgress size={18} sx={{ color: "white" }} />
                <span>Saving Profile...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
