import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/companies/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("companies: ", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // FETCH COMPANIES
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companySlice.reducer;
