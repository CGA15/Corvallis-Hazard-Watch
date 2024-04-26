// storeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";




const hazTypesSlice = createSlice({
  name: "hazards",
  initialState: [{ "id": 0, "name": "Car Crash", "icon": null },
  { "id": 1, "name": "Flood", "icon": null },
  { "id": 2, "name": "Ice", "icon": null },
  { "id": 3, "name": "Land Slide", "icon": null },
  { "id": 4, "name": "Downed Powerline", "icon": null },
  { "id": 5, "name": "Pothole", "icon": null },
  { "id": 6, "name": "Traffic Jam", "icon": null },
  { "id": 7, "name": "Broken Traffic Light", "icon": null },
  { "id": 8, "name": "Construction Zone", "icon": null },
  { "id": 9, "name": "Debris on Road", "icon": null },
  { "id": 10, "name": "Oil Spill", "icon": null },
  { "id": 11, "name": "Pedestrian Crossing", "icon": null },
  { "id": 12, "name": "Animal Crossing", "icon": null },
  { "id": 13, "name": "Vehicle Breakdown", "icon": null },
  { "id": 14, "name": "Blown Tire", "icon": null },
  { "id": 15, "name": "Hailstorm", "icon": null },
  { "id": 16, "name": "Road Closure", "icon": null },
  { "id": 17, "name": "Wrong-Way Driver", "icon": null },
  { "id": 18, "name": "Heavy Fog", "icon": null },
  { "id": 19, "name": "Tornado Warning", "icon": null },
  { "id": 20, "name": "Police Speed Trap", "icon": null },
  { "id": 100, "name": "other", "icon": null }],
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
