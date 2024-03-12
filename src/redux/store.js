import { configureStore } from '@reduxjs/toolkit'

import itemReducer from './storeSlice'

const store = configureStore({
    reducer: {
        items: itemReducer,
    }
})

store.subscribe(() => {
    console.log("== store:", store.getState())
})


export default store