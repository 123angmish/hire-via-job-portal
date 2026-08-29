import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get("http://localhost:8081/api/jobs/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchJobDetails = createAsyncThunk(
  "jobs/fetchJobDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(`http://localhost:8081/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const searchJobs = createAsyncThunk(
  "jobs/searchJobs",
  async ({ keyword, location = "" }, { rejectWithValue }) => {
    try {
      console.log(keyword, location);

      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8081/api/jobs/search?keyword=${keyword}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("searched: ", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const sortJobs = createAsyncThunk(
  "jobs/sortJobs",
  async ({ fieldName, order = "asc" }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8081/api/jobs/sort?field=${fieldName}&order=${order}`,
      );
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    loading: false,
    error: null,

    jobDetails: null,
    loadingJobDetails: false,
    errorJobDetails: null,
  },

  reducers: {
    clearJobDetails: (state, action) => {
      state.jobDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder
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

      // FETCH JOB DETAILS
      .addCase(fetchJobDetails.pending, (state) => {
        state.loadingJobDetails = true;
        state.errorJobDetails = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loadingJobDetails = false;
        state.jobDetails = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loadingJobDetails = false;
        state.errorJobDetails = action.payload;
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

      // SORT JOBS
      .addCase(sortJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sortJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(sortJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
export const { clearJobDetails } = jobSlice.actions;
