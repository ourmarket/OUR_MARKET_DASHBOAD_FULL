/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "deliveriesPositions",
  initialState: {
    feedback: {
      open: false,
      color: "error",
      icon: "error",
      title: "",
      content: "",
      dateTime: "",
    },
  },
  reducers: {
    showFeedback: (state, action) => {
      state.feedback = {
        open: true,
        color: action.payload.color || "error",
        icon: action.payload.icon || "error",
        title: action.payload.title || "Error",
        content: action.payload.content || "",
        dateTime: action.payload.dateTime || "",
      };
    },

    hideFeedback: (state) => {
      state.feedback.open = false;
    },
  },
});

export const { showFeedback, hideFeedback } = uiSlice.actions;
export default uiSlice.reducer;
