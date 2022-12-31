import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHotSingerListRequest, getSingerListRequest } from "../../api/request";

export const fetchHotSingerList = createAsyncThunk('singers/fetchHotSingerList', async (pageCount) => {
    const response = await getHotSingerListRequest(pageCount);
    return response.artists;
})

export const fetchSingerList = createAsyncThunk('singers/fetchSingerList', async ({ category, alpha, pageCount }) => {

    const response = await getSingerListRequest(category, alpha, pageCount);
    return response.artists;
})

const initialState = {
    category: '',
    alpha: '',
    singerList: [],
    enterLoading: true,     //控制进场Loading
    pullUpLoading: false,   //控制上拉加载动画
    pullDownLoading: false, //控制下拉加载动画
    pageCount: 0            //这里是当前页数，我们即将实现分页功能
}

const singersSlice = createSlice({
    name: "singers",
    initialState,
    reducers: {
        changePullUpLoading(state, action) {
            state.pullUpLoading = action.payload;
        },
        changePageCount(state, action) {
            state.pageCount = action.payload;
        },
        changePullDownLoading(state, action) {
            state.pullDownLoading = action.payload;
        },
        changeEnterLoading(state, action) {
            state.enterLoading = action.payload;
        },
        changeAlpha(state, action) {
            state.alpha = action.payload;
        },
        changeCategory(state, action) {
            state.category = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchHotSingerList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.pullDownLoading = false;
                state.pullUpLoading = false;
                if (state.pageCount == 0) {
                    state.singerList = action.payload
                } else {
                    state.singerList = state.singerList.concat(action.payload);
                }
            })
            .addCase(fetchSingerList.fulfilled, (state, action) => {
                state.enterLoading = false;
                state.pullDownLoading = false;
                state.pullUpLoading = false;
                state.singerList = action.payload
                if (state.pageCount == 0) {
                    state.singerList = action.payload
                } else {
                    state.singerList = state.singerList.concat(action.payload);
                }
            })
    }
})

export const selectAllSingerList = (state) => state.singers.singerList;
export const selectEnterLoading = (state) => state.singers.enterLoading;
export const selectPageCount = (state) => state.singers.pageCount;
export const selectPullUpLoading = (state) => state.singers.pullUpLoading;
export const selectPullDownLoading = (state) => state.singers.pullDownLoading;
export const selectCategory = (state) => state.singers.category;
export const selectAlpha = (state) => state.singers.alpha;


export const { changePageCount, changePullUpLoading, changePullDownLoading, changeEnterLoading, changeAlpha, changeCategory } = singersSlice.actions;
export default singersSlice.reducer;
