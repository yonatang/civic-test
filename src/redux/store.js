import {configureStore} from '@reduxjs/toolkit'
import flashcardsSlice from './flashcardsSlice.js'

export default configureStore({
    reducer: {
        flashcards: flashcardsSlice
    },
})