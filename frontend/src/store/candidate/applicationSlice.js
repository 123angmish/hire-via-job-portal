import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/applications/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data || "Failed to fetch applications";
      return rejectWithValue(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }
);

export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async (applicationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.post(
        `http://localhost:8081/api/applications/apply/${applicationData?.id}`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data || "Failed to submit application";
      return rejectWithValue(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }
);

const applicationSlice = createSlice({
  name: "job",
  initialState: {
    applications: [],
    loading: false,
    error: null,

    applyJobLoading: false,
    applyJobError: null,
  },

  reducers: {
    clearApplyJobError: (state) => {
      state.applyJobError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH JOBS
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // APPLY JOB
      .addCase(applyJob.pending, (state) => {
        state.applyJobLoading = true;
        state.applyJobError = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.applyJobLoading = false;
        state.applyJobError = null;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.applyJobLoading = false;
        state.applyJobError = action.payload;
      });
  },
});

export const { clearApplyJobError } = applicationSlice.actions;

export default applicationSlice.reducer;
