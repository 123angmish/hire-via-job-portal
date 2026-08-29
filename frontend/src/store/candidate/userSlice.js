import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");

      const { data } = await axios.get(
        "http://localhost:8081/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("profile", data);

      return data;
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      console.log(token);

      const { data } = await axios.put(
        "http://localhost:8081/api/users/edit-profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("edit profile: ", data);

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,

    editProfileLoading: false,
    editProfileError: false,
  },

  extraReducers: (builder) => {
    builder
      // FETCH USER PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT PROFILE
      .addCase(editProfile.pending, (state) => {
        state.editProfileLoading = true;
        state.editProfileError = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.editProfileLoading = false;
        state.user = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.editProfileLoading = false;
        state.editProfileError = action.payload;
      });
  },
});

export default userSlice.reducer;
