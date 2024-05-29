import { configureStore } from '@reduxjs/toolkit'

import itemReducer from './storeSlice'
import hazTypesRedux from './hazTypesRedux'
import iconSlice from './iconSlice'
import sensorSlice from './sensorSlice'

const store = configureStore({
    reducer: {
        items: itemReducer,
        hazards: hazTypesRedux,
        icons: iconSlice,
        sensor: sensorSlice,
    }
})

store.subscribe(() => {
    //console.log("== store:", store.getState())
})


export default store