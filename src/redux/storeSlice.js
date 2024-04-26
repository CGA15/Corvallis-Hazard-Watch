import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const FileLocation = "/api/hazards";

export const fetchData = createAsyncThunk('store/fetchData', async () => {
  try {
    const response = await fetch(FileLocation);
    const data = await response.json();
    return { data: data.data, fetchedAt: Date.now() }; // Include the fetchedAt timestamp
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
});

const storeSlice = createSlice({
  name: "items",
  initialState: { items: [], fetchedAt: null }, // Initial state includes items array and fetchedAt timestamp
  reducers: {
    add(state, action) {
      const newItem = action.payload;
      const maxId = Math.max(...state.items.map(item => item.id), 0);
      newItem.id = maxId + 1;
      state.items.push(newItem);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.items = action.payload.data.map(item => ({ ...item}));
      state.fetchedAt = action.payload.fetchedAt; // Update fetchedAt timestamp
    });
  },
});

export default storeSlice.reducer;
export const { add } = storeSlice.actions;
export const selectStore = state => state.items.items; // Adjust selector for nested state
export const selectFetchedAt = state => state.items.fetchedAt; // Selector for fetchedAt timestamp
