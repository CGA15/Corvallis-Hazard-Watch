import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const FileLocation = "/api/getsensor";

export const fetchSensor = createAsyncThunk('store/fetchSensor', async () => {
  try {
    const response = await fetch(FileLocation);
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
});

const sensorSlice = createSlice({
  name: "sensor",
  initialState: [], // Initial state includes items array and fetchedAt timestamp
  extraReducers: (builder) => {
    builder.addCase(fetchSensor.fulfilled, (state, action) => {
      return action.payload.data.map(sensor => ({ ...sensor}));
    });
  },
});

export default sensorSlice.reducer;
export const selectSensorItems = sensorSlice.selectSlice;

export function selectSensor(state) {
  const sensors = selectSensorItems(state);
  return sensors;
}