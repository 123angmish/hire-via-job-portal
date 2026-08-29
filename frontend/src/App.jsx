import React from "react";
import { Route, Routes } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import CandidateDashboardLayout from "./layouts/CandidateDashboardLayout";
import EmployerDashboardLayout from "./layouts/EmployerDashboardLayout";

// Public Pages
import Home from "./pages/Home/Home";
import FindJob from "./pages/FIndJob/FindJob";
import JobDetails from "./pages/Job/JobDetails";
import JobApply from "./pages/Job/JobApply";
import Signup from "./pages/Authentication/Signup";
import Login from "./pages/Authentication/Login";

// Candidate Dashboard Pages
import Profile from "./pages/Dashboard/Candidate/Profile/Profile";
import EditProfile from "./pages/Dashboard/Candidate/Profile/EditProfile";
import SavedJobs from "./pages/Dashboard/Candidate/SavedJobs/SavedJobs";
import RecommendedJobs from "./pages/Dashboard/Candidate/RecommendedJobs/RecommendedJobs";
import AppliedJobs from "./pages/Dashboard/Candidate/JobApply/AppliedJobs";

// Employer Dashboard Pages
import PostJob from "./pages/Dashboard/Employer/PostJobs/PostJob";
import ManageJobs from "./pages/Dashboard/Employer/ManageJobs/ManageJobs";
import CompanyProfile from "./pages/Dashboard/Employer/Profile/CompanyProfile";
import EditCompanyProfile from "./pages/Dashboard/Employer/Profile/EditCompanyProfile";
import Applicants from "./pages/Dashboard/Employer/Applicants/Applicants";

import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/jobs"
        element={
          <PublicLayout>
            <FindJob />
          </PublicLayout>
        }
      />
      <Route
        path="/find-jobs"
        element={
          <PublicLayout>
            <FindJob />
          </PublicLayout>
        }
      />

      {/* Job Details Routes */}
      <Route
        path="/job-details/:id"
        element={
          <PublicLayout>
            <JobDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/job_details/:id"
        element={
          <PublicLayout>
            <JobDetails />
          </PublicLayout>
        }
      />

      {/* Job Apply Routes (Support all variants) */}
      <Route
        path="/job-details/:id/apply"
        element={
          <PublicLayout>
            <JobApply />
          </PublicLayout>
        }
      />
      <Route
        path="/job_details/:id/apply"
        element={
          <PublicLayout>
            <JobApply />
          </PublicLayout>
        }
      />
      <Route
        path="/job-apply/:id"
        element={
          <PublicLayout>
            <JobApply />
          </PublicLayout>
        }
      />
      <Route
        path="/job_apply/:id"
        element={
          <PublicLayout>
            <JobApply />
          </PublicLayout>
        }
      />

      {/* Direct Employer Top-Level Route Aliases */}
      <Route
        path="/post-job"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <PostJob />
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post_job"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <PostJob />
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-jobs"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <ManageJobs />
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage_jobs"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <ManageJobs />
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-profile"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <CompanyProfile />
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company_profile"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <CompanyProfile />
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Candidate Profile / Dashboard Routes */}
      <Route
        path="/profile/*"
        element={
          <ProtectedRoute role="CANDIDATE">
            <CandidateDashboardLayout>
              <Routes>
                <Route path="" element={<Profile />} />
                <Route path="applied-jobs" element={<AppliedJobs />} />
                <Route path="applied_jobs" element={<AppliedJobs />} />
                <Route path="saved-jobs" element={<SavedJobs />} />
                <Route path="saved_jobs" element={<SavedJobs />} />
                <Route path="recommended-jobs" element={<RecommendedJobs />} />
                <Route path="recommended_jobs" element={<RecommendedJobs />} />
                <Route path="edit" element={<EditProfile />} />
              </Routes>
            </CandidateDashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Employer Dashboard Routes */}
      <Route
        path="/employer/*"
        element={
          <ProtectedRoute role="EMPLOYER">
            <EmployerDashboardLayout>
              <Routes>
                <Route path="post-job" element={<PostJob />} />
                <Route path="post_job" element={<PostJob />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="manage_jobs" element={<ManageJobs />} />
                <Route path="view-applicants" element={<Applicants />} />
                <Route path="view_applicants" element={<Applicants />} />
                <Route path="company-profile" element={<CompanyProfile />} />
                <Route path="company_profile" element={<CompanyProfile />} />
                <Route
                  path="edit-company-profile"
                  element={<EditCompanyProfile />}
                />
              </Routes>
            </EmployerDashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Authentication Wrapped in PublicLayout with Header & Footer */}
      <Route
        path="/signup"
        element={
          <PublicLayout>
            <Signup />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
    </Routes>
  );
};

export default App;
