import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBannerRequest, getRecommendListRequest } from "../../api/request";

export const fetchBannerList = createAsyncThunk('recommend/fetchBannerList', async () => {
    const response = await getBannerRequest();
    return response.banners;
})

export const fetchRecommendList = createAsyncThunk('recommend/fetchRecommendList', async () => {
    const response = await getRecommendListRequest();
    return response.result;
})

const initialState = {
    bannerList: [],
    recommendList: [],
    enterLoading: true
}

const recommendSlice = createSlice({
    name: "recommend",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchBannerList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.bannerList = action.payload;
            })
            .addCase(fetchRecommendList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.recommendList = action.payload;
            })
    }
})

export const selectAllBanners = (state) => state.recommend.bannerList;
export const selectAllRecommendList = (state) => state.recommend.recommendList;
export const selectEnterLoading = (state) => state.recommend.enterLoading;


export default recommendSlice.reducer;
