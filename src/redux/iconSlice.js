import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const FileLocation = "/api/hazardIcons.json";

export const fetchIcons = createAsyncThunk('store/fetchIcons', async () => {
  try {
    const response = await fetch(FileLocation);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
});

const iconSlice = createSlice({
  name: "icons",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIcons.fulfilled, (state, action) => {
      console.log("testing for icons",action.payload)
      return action.payload.map(icon => ({ ...icon}));
    });
  },
});

export default iconSlice.reducer;
export const selectIconsItems = iconSlice.selectSlice;

export function selectIcons(state) {
  const icons = selectIconsItems(state);
  return icons;
}


