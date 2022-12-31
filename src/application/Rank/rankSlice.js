import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRankListRequest } from '../../api/request';

export const fetchRankList = createAsyncThunk('recommend/fetchRankList', async () => {
    const response = await getRankListRequest();
    return response.list;
})

const initialState = {
    rankList: [],
    loading: true
}

const rankSlice = createSlice({
    name: 'rank',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchRankList.fulfilled, (state, action) => {
                state.loading = false;
                state.rankList = action.payload;
            })
    }
})
export const selectLoading = (state) => state.rank.loading;
export const selectRankList = (state) => state.rank.rankList;


export default rankSlice.reducer;