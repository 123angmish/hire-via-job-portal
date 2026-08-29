import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSavedJobs = createAsyncThunk(
  "saveJobs/fetchSavedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/saved-jobs/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("saved jobs: ", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const saveJob = createAsyncThunk(
  "saveJobs/saveJob",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.post(
        `http://localhost:8081/api/saved-jobs/add/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Job Saved!");

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const removeSaveJob = createAsyncThunk(
  "saveJobs/removeSaveJob",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.delete(
        `http://localhost:8081/api/saved-jobs/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Job Removed From Saved!");

      return id;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const saveJobSlice = createSlice({
  name: "job",
  initialState: {
    savedJobs: [],
    loading: false,
    error: null,

    saveJobId: null,

    removeSaveJobId: null,
  },

  extraReducers: (builder) => {
    builder
      // FETCH SAVED JOBS
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // SAVE JOB
      .addCase(saveJob.pending, (state, action) => {
        console.log("action: ", action.meta.arg);

        state.saveJobId = action.meta.arg;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        console.log("save job id", state.saveJobId);

        state.savedJobs.push(action.payload);

        state.saveJobId = null;
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.saveJobId = null;
      })
      // SAVE JOB
      .addCase(removeSaveJob.pending, (state, action) => {
        console.log("action: ", action.meta.arg);

        state.removeSaveJobId = action.meta.arg;
      })
      .addCase(removeSaveJob.fulfilled, (state, action) => {
        console.log("remove save job id", state.removeSaveJobId);
        state.savedJobs = state.savedJobs.filter(
          (elem) => elem.id != action.payload
        );
        state.removeSaveJobId = null;
      })
      .addCase(removeSaveJob.rejected, (state, action) => {
        state.removeSaveJobId = null;
      });
  },
});

export default saveJobSlice.reducer;
