import { configureStore } from '@reduxjs/toolkit'

import itemReducer from './storeSlice'
import hazTypesRedux from './hazTypesRedux'
import iconSlice from './iconSlice'

const store = configureStore({
    reducer: {
        items: itemReducer,
        hazards: hazTypesRedux,
        icons: iconSlice,
    }
})

store.subscribe(() => {
    //console.log("== store:", store.getState())
})


export default store