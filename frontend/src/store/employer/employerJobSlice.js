import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const postJob = createAsyncThunk(
  "jobs/postJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.post(
        "http://localhost:8081/api/employer/jobs",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("job: ", data);
      toast.success("Job posted successfully!", { autoClose: 1300 });

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data?.message || error.response?.data || "Something went wrong");
    }
  },
);

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/employer/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Fetch Jobs: ", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.delete(
        `http://localhost:8081/api/employer/jobs/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Job deleted successfully!", { autoClose: 1300 });

      return id;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const searchJobs = createAsyncThunk(
  "jobs/searchJobs",
  async (keyword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8081/api/jobs/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.put(
        `http://localhost:8081/api/employer/jobs/update/${jobData?.id}`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("update job: ", data);
      toast.success("Job updated successfully!", { autoClose: 1300 });

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const employerJobSlice = createSlice({
  name: "employerJob",
  initialState: {
    jobs: [],
    loading: false,
    error: null,

    createJobLoading: false,
    createJobError: null,

    deletingJobId: null,

    updateLoading: false,
  },

  reducers: {
    clearJobErrors: (state) => {
      state.createJobError = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // POST JOB
      .addCase(postJob.pending, (state) => {
        state.createJobLoading = true;
        state.createJobError = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.createJobLoading = false;
        state.createJobError = null;
        state.jobs = [action.payload, ...state.jobs];
      })
      .addCase(postJob.rejected, (state, action) => {
        state.createJobLoading = false;
        state.createJobError = action.payload;
      })

      // FETCH JOBS
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE JOB
      .addCase(deleteJob.pending, (state, action) => {
        state.deletingJobId = action.meta.arg;
      })
      .addCase(deleteJob.fulfilled, (state) => {
        state.jobs = state.jobs.filter((j) => j.id != state.deletingJobId);
        state.deletingJobId = null;
      })
      .addCase(deleteJob.rejected, (state) => {
        state.deletingJobId = null;
      })

      // SEARCH JOBS
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE JOB
      .addCase(updateJob.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.jobs = state.jobs.map((job) =>
          job?.id == action.payload.id ? action?.payload : job,
        );
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobErrors } = employerJobSlice.actions;

export default employerJobSlice.reducer;
