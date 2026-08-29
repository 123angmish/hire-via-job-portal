import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRecommendedJobs = createAsyncThunk(
  "recommendedJobs/fetchRecommendedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/jobs/recommended",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("recommended", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const recommendedJobSlice = createSlice({
  name: "recommendedJobs",
  initialState: {
    recommendedJobs: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // FETCH JOBS
      .addCase(fetchRecommendedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload;
      })
      .addCase(fetchRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recommendedJobSlice.reducer;
