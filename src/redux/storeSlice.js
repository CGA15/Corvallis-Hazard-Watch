// storeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const FileLocation = "/api/hazards";

export const fetchData = createAsyncThunk('store/fetchData', async () => {
  try {
    const response = await fetch(FileLocation);
    const data = await response.json();
    console.log("data from redux fetch")
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
});

const storeSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    add(state, action) {
      const newItem = action.payload;
      state.items.push(newItem);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      return action.payload.map(item => ({ ...item}));
    });
  },
});

export default storeSlice.reducer;
export const { add } = storeSlice.actions;
export const selectItems = storeSlice.selectSlice;

export function selectStore(state) {
  console.log(`state = ${state}`);
  const items = selectItems(state);
  console.log(`== items ${items}`);
  return items;
}
