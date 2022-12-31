import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSingerInfoRequest } from "../../api/request";


export const fetchSingerInfo = createAsyncThunk('singers/fetchSingerInfo', async (id) => {
    const response = await getSingerInfoRequest(id);
    return response;
})

const initialState = {
    artist: {},
    songsOfArtist: [],
    loading: true
}

const singerSlice = createSlice({
    name: "singer",
    initialState,
    reducers: {
        changeArtist(state, action) {
            state.artist = action.payload;
        },
        changeSongsOfArtist(state, action) {
            state.songsOfArtist = action.payload;
        },
        changeLoading(state, action) {
            state.loading = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSingerInfo.fulfilled, (state, action) => {
                state.artist = action.payload.artist;
                state.songsOfArtist = action.payload.hotSongs;
                state.loading = false;
            })
    }
})

export const selectArtist = (state) => state.singer.artist;
export const selectEnterLoading = (state) => state.singer.loading;
export const selectSongsOfArtist = (state) => state.singer.songsOfArtist;



export const { changeArtist, changeLoading, changeSongsOfArtist } = singerSlice.actions;
export default singerSlice.reducer;
