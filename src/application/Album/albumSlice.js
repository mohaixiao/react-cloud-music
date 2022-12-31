import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAlbumDetailRequest } from '../../api/request';

export const fetchAlbumList = createAsyncThunk('recommend/fetchAlbumList', async (id) => {
    const response = await getAlbumDetailRequest(id);
    return response.playlist;
})

const initialState = {
    currentAlbum: {},
    enterLoading: false,
}

const albumSlice = createSlice({
    name: 'album',
    initialState,
    reducers: {
        changeEnterLoading(state, action) {
            state.enterLoading = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAlbumList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.currentAlbum = action.payload;
            })
    }
})
export const selectAlbum = (state) => state.album.currentAlbum;
export const selectLoading = (state) => state.album.enterLoading;

export const { changeEnterLoading } = albumSlice.actions;

export default albumSlice.reducer;