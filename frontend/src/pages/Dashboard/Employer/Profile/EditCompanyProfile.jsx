import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary";
import { useDispatch, useSelector } from "react-redux";
import {
  editCompanyProfile,
  fetchEmployerProfile,
  clearUpdateStatus,
} from "../../../../store/employer/employerSlice";

const INDUSTRY_OPTIONS = [
  "IT",
  "FINANCE",
  "HEALTHCARE",
  "EDUCATION",
  "MARKETING",
  "MANUFACTURING",
  "OTHER",
];

const BUSINESS_TYPE_OPTIONS = [
  "PRIVATE",
  "GOVERNMENT",
  "STARTUP",
  "NGO",
];

const COMPANY_SIZE_OPTIONS = ["Small", "Medium", "Large", "Enterprise"];

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  websiteUrl: Yup.string().trim().nullable(),

  industry: Yup.string().nullable(),

  size: Yup.string().nullable(),

  location: Yup.string().trim().max(200, "Location must not exceed 200 characters").nullable(),

  ownerEmail: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Contact email is required"),

  ownerPhoneNumber: Yup.string().trim().nullable(),

  description: Yup.string().trim().max(1000, "Description must not exceed 1000 characters").nullable(),

  foundedYear: Yup.string().trim().nullable(),

  businessType: Yup.string().nullable(),

  ownerName: Yup.string().trim().max(100, "Owner name must not exceed 100 characters").nullable(),

  logoUrl: Yup.string().nullable(),
});

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: { xs: 40, sm: 48, md: 52 },
    fontSize: { xs: "12px", sm: "13px", md: "14px" },
    "& input": {
      padding: { xs: "0 10px", sm: "0 12px", md: "0 14px" },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: { xs: "11px", sm: "12px", md: "13px" },
  },
};

const selectSx = {
  "& .MuiInputBase-root": {
    height: { xs: 36, sm: 44, md: 52 },
    fontSize: { xs: "12px", sm: "13px", md: "14px" },
    "& svg": {
      fontSize: { xs: "18px", sm: "20px", md: "22px" },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: { xs: "11px", sm: "12px", md: "13px" },
  },
};

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const { employer, updateLoading, updateError } = useSelector(
    (state) => state.employer
  );

  useEffect(() => {
    dispatch(fetchEmployerProfile());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: employer?.company?.id || null,
      name: employer?.company?.name || employer?.user?.fullName || "",
      websiteUrl: employer?.company?.websiteUrl || "",
      industry: employer?.company?.industry ? employer.company.industry.toUpperCase() : "",
      size: employer?.company?.size || "",
      location: employer?.company?.location || employer?.user?.location || "",
      ownerEmail: employer?.company?.ownerEmail || employer?.user?.email || "",
      ownerPhoneNumber: employer?.company?.ownerPhoneNumber || employer?.user?.phoneNumber || "",
      ownerName: employer?.company?.ownerName || employer?.user?.fullName || "",
      description: employer?.company?.description || "",
      foundedYear: employer?.company?.foundedYear || "",
      businessType: employer?.company?.businessType ? employer.company.businessType.toUpperCase() : "",
      logoUrl: employer?.company?.logoUrl || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let formattedWebsite = values.websiteUrl ? values.websiteUrl.trim() : "";
      if (
        formattedWebsite &&
        !formattedWebsite.startsWith("http://") &&
        !formattedWebsite.startsWith("https://")
      ) {
        formattedWebsite = `https://${formattedWebsite}`;
      }

      const payload = {
        ...values,
        websiteUrl: formattedWebsite,
        industry: values.industry ? values.industry.toUpperCase() : null,
        businessType: values.businessType ? values.businessType.toUpperCase() : null,
      };

      const resultAction = await dispatch(editCompanyProfile(payload));
      if (editCompanyProfile.fulfilled.match(resultAction)) {
        await dispatch(fetchEmployerProfile());
        navigate("/employer/company-profile", { state: { updated: true } });
      }
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      formik.setFieldError("logoUrl", "Only image files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      formik.setFieldValue("logoUrl", reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        formik.setFieldValue("logoUrl", url);
      }
    } catch (err) {
      console.error("Cloudinary upload failed, keeping local preview", err);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => fileInputRef.current.click();

  return (
    <section className="lg:px-10 px-4 lg:pb-8 pb-12.5">
      {/* Error Notification Banner */}
      {updateError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3 text-rose-800 shadow-sm animate-fade-in">
          <ErrorOutlineIcon sx={{ color: "#ef4444", fontSize: 24 }} />
          <div>
            <p className="font-bold text-[14px]">Update Failed</p>
            <p className="text-[12px] text-rose-700">
              {typeof updateError === "string" ? updateError : "Could not save company profile. Please check details."}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full flex justify-center items-center bg-[#f0f9ff] border-2 border-[#1a6079]/30 shadow-md overflow-hidden relative group">
          {formik.values.logoUrl ? (
            <img
              className="w-full h-full object-cover"
              src={formik.values.logoUrl}
              alt="Company Logo"
              onError={() => formik.setFieldValue("logoUrl", "")}
            />
          ) : (
            <ApartmentIcon sx={{ fontSize: { xs: 40, lg: 52 }, color: "#1a6079" }} />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[11px] font-medium">
              <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin mb-1"></div>
              Uploading...
            </div>
          )}
        </div>

        <div>
          <h3 className="lg:text-[18px] text-[15px] font-semibold text-gray-800">
            {formik.values.name || "Company Logo"}
          </h3>
          <Button
            variant="outlined"
            onClick={handleButtonClick}
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
              Change Logo
            </span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-8 flex flex-col gap-6">
          {/* Row 1 — name + websiteUrl */}
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Company Name"
              variant="outlined"
              placeholder="Enter your company name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              id="websiteUrl"
              name="websiteUrl"
              label="Website URL"
              variant="outlined"
              placeholder="https://example.com"
              value={formik.values.websiteUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
              helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
              sx={textFieldSx}
            />
          </div>

          {/* Row 2 — industry + size */}
          <div className="flex flex-col sm:flex-row gap-4">
            <FormControl
              fullWidth
              size="small"
              sx={selectSx}
              error={formik.touched.industry && Boolean(formik.errors.industry)}
            >
              <InputLabel id="industry-label">Industry Type</InputLabel>
              <Select
                labelId="industry-label"
                id="industry"
                name="industry"
                label="Industry Type"
                value={formik.values.industry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">Select Industry</MenuItem>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt.charAt(0) + opt.slice(1).toLowerCase().replace("_", " ")}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.industry && formik.errors.industry && (
                <FormHelperText>{formik.errors.industry}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={selectSx}
              error={formik.touched.size && Boolean(formik.errors.size)}
            >
              <InputLabel id="size-label">Company Size</InputLabel>
              <Select
                labelId="size-label"
                id="size"
                name="size"
                label="Company Size"
                value={formik.values.size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">Select Size</MenuItem>
                {COMPANY_SIZE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.size && formik.errors.size && (
                <FormHelperText>{formik.errors.size}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Row 3 — businessType + foundedYear */}
          <div className="flex flex-col sm:flex-row gap-4">
            <FormControl
              fullWidth
              size="small"
              sx={selectSx}
              error={formik.touched.businessType && Boolean(formik.errors.businessType)}
            >
              <InputLabel id="businessType-label">Business Type</InputLabel>
              <Select
                labelId="businessType-label"
                id="businessType"
                name="businessType"
                label="Business Type"
                value={formik.values.businessType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="">Select Business Type</MenuItem>
                {BUSINESS_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt.charAt(0) + opt.slice(1).toLowerCase().replace("_", " ")}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.businessType && formik.errors.businessType && (
                <FormHelperText>{formik.errors.businessType}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="foundedYear"
              name="foundedYear"
              label="Founded Year"
              variant="outlined"
              placeholder="e.g. 2022"
              value={formik.values.foundedYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.foundedYear && Boolean(formik.errors.foundedYear)}
              helperText={formik.touched.foundedYear && formik.errors.foundedYear}
              sx={textFieldSx}
            />
          </div>

          {/* Row 4 — location + ownerEmail */}
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              variant="outlined"
              placeholder="City, Country"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              id="ownerEmail"
              name="ownerEmail"
              label="Contact Email"
              variant="outlined"
              placeholder="contact@company.com"
              value={formik.values.ownerEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ownerEmail && Boolean(formik.errors.ownerEmail)}
              helperText={formik.touched.ownerEmail && formik.errors.ownerEmail}
              sx={textFieldSx}
            />
          </div>

          {/* Row 5 — ownerName + ownerPhoneNumber */}
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              fullWidth
              id="ownerName"
              name="ownerName"
              label="Owner Name"
              variant="outlined"
              placeholder="Your Name"
              value={formik.values.ownerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
              helperText={formik.touched.ownerName && formik.errors.ownerName}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              id="ownerPhoneNumber"
              name="ownerPhoneNumber"
              label="Phone Number"
              variant="outlined"
              placeholder="+91 9876543210"
              value={formik.values.ownerPhoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ownerPhoneNumber && Boolean(formik.errors.ownerPhoneNumber)}
              helperText={formik.touched.ownerPhoneNumber && formik.errors.ownerPhoneNumber}
              sx={textFieldSx}
            />
          </div>

          {/* description */}
          <TextField
            fullWidth
            multiline
            rows={6}
            id="description"
            name="description"
            label="About Company"
            variant="outlined"
            placeholder="Write a brief overview about your company..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={
              (formik.touched.description && formik.errors.description) ||
              `${formik.values.description?.length ?? 0}/1000`
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: { xs: "12px", sm: "13px", md: "14px" },
                "& textarea": {
                  padding: { xs: "8px 10px", sm: "10px 12px", md: "12px 14px" },
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "11px", sm: "12px", md: "13px" },
              },
            }}
          />

          {/* Submit */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={updateLoading}
            sx={{
              background: "#1a6079",
              textTransform: "capitalize",
              py: { xs: 1, sm: 1.2, md: 1.5 },
              mt: 2,
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              fontWeight: 700,
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(26,96,121,0.25)",
              "&:hover": { background: "#124557" },
            }}
          >
            {updateLoading ? "Saving & Redirecting..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditCompanyProfile;