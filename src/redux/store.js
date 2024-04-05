import { configureStore } from '@reduxjs/toolkit'

import itemReducer from './storeSlice'
import hazTypesRedux from './hazTypesRedux'

const store = configureStore({
    reducer: {
        items: itemReducer,
        hazards: hazTypesRedux,
    }
})

store.subscribe(() => {
    //console.log("== store:", store.getState())
})


export default store