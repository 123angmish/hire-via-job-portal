import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchApplicants = createAsyncThunk(
  "applicants/fetchApplicants",
  async (employerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const url = employerId
        ? `http://localhost:8081/api/employer/applications/${employerId}`
        : `http://localhost:8081/api/employer/applications`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to load applicants"
      );
    }
  }
);

export const updateApplicantStatus = createAsyncThunk(
  "applicants/updateStatusApplicant",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.put(
        `http://localhost:8081/api/employer/applications/${applicationId}/status?status=${status}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { applicationId, status, data };
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update status"
      );
    }
  }
);

export const searchApplicants = createAsyncThunk(
  "applicants/searchApplicants",
  async ({ employerId, keyword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        `http://localhost:8081/api/employer/applications/${employerId}/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Search failed"
      );
    }
  }
);

const employerApplicantSlice = createSlice({
  name: "employerApplicant",
  initialState: {
    applicants: [],
    loading: false,
    error: null,
    updateStatusLoading: false,
  },

  reducers: {
    setLocalStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      state.applicants = state.applicants.map((a) =>
        a.id === applicationId ? { ...a, status } : a
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH APPLICANTS
      .addCase(fetchApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload || [];
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE STATUS
      .addCase(updateApplicantStatus.pending, (state) => {
        state.updateStatusLoading = true;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        const { applicationId, status, data } = action.payload;
        state.applicants = state.applicants.map((a) => {
          if (a.id === applicationId) {
            return {
              ...a,
              ...(data && typeof data === "object" ? data : {}),
              status: status,
            };
          }
          return a;
        });
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.error = action.payload;
      })

      // SEARCH APPLICANTS
      .addCase(searchApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload || [];
      })
      .addCase(searchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLocalStatus } = employerApplicantSlice.actions;

export default employerApplicantSlice.reducer;
