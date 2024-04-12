// storeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const FileLocation = "/api/hazards";

export const fetchData = createAsyncThunk('store/fetchData', async () => {
  try {
    const response = await fetch(FileLocation);
    const data = await response.json();
    ////console.log("data from redux fetch")
    ////console.log(data.data);
    //console.log("data from file")
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
      const maxId = Math.max(...state.map(item => item.id), 0); // Find the maximum ID
      newItem.id = maxId + 1; // Set the new item's ID to 1 more than the maximum ID
      console.log("newItem",newItem)
      state.push(newItem);
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
  ////console.log(`state = ${state}`);
  const items = selectItems(state);
  ////console.log(`== items ${items}`);
  return items;
}
