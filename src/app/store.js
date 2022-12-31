import { configureStore } from '@reduxjs/toolkit'
import recommendReducer from '../application/Recommend/recommendSlice'
import singersReducer from '../application/Singers/singersSlice'
import rankReducer from '../application/Rank/rankSlice'
import albumReducer from '../application/Album/albumSlice'
import singerReducer from '../application/Singer/singerSlice'
import playerReducer from '../application/Player/playerSlice'
import searchReducer from '../application/Search/searchSlice'

export const store = configureStore({
    reducer: {
        recommend: recommendReducer,
        singers: singersReducer,
        rank: rankReducer,
        album: albumReducer,
        singer: singerReducer,
        player: playerReducer,
        search: searchReducer
    },
})