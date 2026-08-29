import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (applicationId, { rejectWithValue }) => {
    try {
      if (!applicationId) return [];
      const token = localStorage.getItem("jwt");
      const headers = {};
      if (token && token !== "null" && token !== "undefined") {
        headers.Authorization = `Bearer ${token}`;
      }

      const { data } = await axios.get(
        `http://localhost:8081/api/chat/${applicationId}`,
        { headers }
      );
      return data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages"
      );
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { applicationId, jobId, message, senderRole, senderName },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("jwt");
      const role =
        senderRole || localStorage.getItem("role") || "CANDIDATE";
      const headers = {};
      if (token && token !== "null" && token !== "undefined") {
        headers.Authorization = `Bearer ${token}`;
      }

      const { data } = await axios.post(
        "http://localhost:8081/api/chat/send",
        {
          applicationId,
          jobId,
          message,
          senderRole: role,
          senderName,
        },
        { headers }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    sending: false,
    error: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    appendOptimisticMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchChatMessages.rejected, (state) => {
        state.loading = false;
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.sending = false;
        if (action.payload && action.payload.id) {
          const exists = state.messages.some((m) => m.id === action.payload.id);
          if (!exists) {
            state.messages.push(action.payload);
          }
        }
      })
      .addCase(sendChatMessage.rejected, (state) => {
        state.sending = false;
      });
  },
});

export const { clearChat, appendOptimisticMessage } = chatSlice.actions;
export default chatSlice.reducer;
