import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getResultSongsListRequest, getHotKeyWordsRequest, getSuggestListRequest } from "../../api/request";

export const fetchHotKeyWords = createAsyncThunk('search/fetchHotKeyWords', async () => {
    const response = await getHotKeyWordsRequest();
    return response.result.hots;
})

export const fetchSuggestList = createAsyncThunk('search/fetchSuggestList', async (query) => {
    const response = await getSuggestListRequest(query);
    return response.result
})

export const fetchResultSongsList = createAsyncThunk('search/fetchResultSongsList', async (query) => {
    const response = await getResultSongsListRequest(query);
    return response.result.songs
})



const initialState = {
    hotList: [],
    suggestList: [],
    songsList: [],
    enterLoading: false
}

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        changeHotKeyWords(state, action) {
            state.hotList = action.payload
        },
        changeSuggestList(state, action) {
            state.suggestList = action.payload;
        },
        changeResultSongs(state, action) {
            state.songsList = action.payload;
        },
        changeEnterLoading(state, action) {
            state.enterLoading = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchHotKeyWords.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.hotList = action.payload;
            })
            .addCase(fetchSuggestList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.suggestList = action.payload || [];

            })
            .addCase(fetchResultSongsList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.songsList = action.payload || [];
            })
    }
})

export const selectHotList = (state) => state.search.hotList;
export const selectSuggestList = (state) => state.search.suggestList;
export const selectEnterLoading = (state) => state.search.enterLoading;
export const selectSongsList = (state) => state.search.songsList;

export const {
    changeEnterLoading,
    changeHotKeyWords,
    changeResultSongs,
    changeSuggestList
} = searchSlice.actions;

export default searchSlice.reducer;
