// storeSlice.js

//this slice stores hazard data
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const FileLocation = "/api/hazardtypes.json";


export const fetchTypes = createAsyncThunk('store/fetchTypes', async () => {
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


const hazTypesSlice = createSlice({
  name: "hazards",
  initialState: [],
  extraReducers: (builder) => {
    builder.addCase(fetchTypes.fulfilled, (state, action) => {
      // console.log("testing for types",action.payload)
      return action.payload.map(item => ({ ...item}));
    });
  },
});

export default hazTypesSlice.reducer;
// export const { add } = storeSlice.actions;
export const selectHazItems = hazTypesSlice.selectSlice;

export function selectHazTypes(state) {
  //console.log(`state = for haz types${state}`);
  //console.log(state)
  const hazards = selectHazItems(state);
  //console.log(`== items ${hazards}`);
  //console.log(hazards)
  return hazards;
}

