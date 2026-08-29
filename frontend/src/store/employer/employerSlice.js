import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmployerProfile = createAsyncThunk(
  "employers/fetchEmployer",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/employers/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("employer profile", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const editCompanyProfile = createAsyncThunk(
  "employers/editCompanyProfile",
  async (companyData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("jwt");
      const url = companyData?.id
        ? `http://localhost:8081/api/employer/companies/${companyData.id}`
        : `http://localhost:8081/api/employer/companies/profile`;

      const { data } = await axios.put(
        url,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("edit company profile: ", data);
      dispatch(fetchEmployerProfile());

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || "Failed to update company");
    }
  },
);

const employerSlice = createSlice({
  name: "employer",
  initialState: {
    employer: null,
    loading: false,
    error: null,

    updateLoading: false,
    updateError: false,
    updateSuccess: false,
  },
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH EMPLOYER PROFILE
      .addCase(fetchEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.employer = action.payload;
      })
      .addCase(fetchEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE COMPANY PROFILE
      .addCase(editCompanyProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(editCompanyProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (state.employer) {
          state.employer.company = action.payload;
        }
      })
      .addCase(editCompanyProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { clearUpdateStatus } = employerSlice.actions;
export default employerSlice.reducer;
