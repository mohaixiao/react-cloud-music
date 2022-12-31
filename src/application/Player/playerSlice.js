import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSongDetailRequest } from '../../api/request';

import { findIndex } from '../../api/utils';// 注意引入工具方法
import { playMode } from '../../api/config';

export const fetchSongDetailRequest = createAsyncThunk('player/fetchSongDetailRequest', async (id) => {
    const response = await getSongDetailRequest(id)
    return response.songs[0];
})

const initialState = {
    fullScreen: false,//播放器是否为全屏模式
    playing: false, //当前歌曲是否播放
    sequencePlayList: [], //顺序列表(因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
    playList: [],
    mode: playMode.sequence,//播放模式
    currentIndex: -1,//当前歌曲在播放列表的索引位置
    showPlayList: false,//是否展示播放列表
    currentSong: {}
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        changeCurrentSong(state, action) {
            state.currentSong = action.payload;
        },
        changeFullScreen(state, action) {
            state.fullScreen = action.payload;
        },
        changePlayingState(state, action) {
            state.playing = action.payload;
        },
        changeSequecePlayList(state, action) {
            state.sequencePlayList = action.payload;
        },
        changePlayList(state, action) {
            state.playList = action.payload;
        },
        changePlayMode(state, action) {
            state.mode = action.payload;
        },
        changeCurrentIndex(state, action) {
            state.currentIndex = action.payload;
        },
        changeShowPlayList(state, action) {
            state.showPlayList = action.payload;
        },
        deletesong(state, action) {
            // 找对应歌曲在播放列表中的索引
            const fpIndex = findIndex(action.payload, state.playList);
            // 在播放列表中将其删除
            state.playList.splice(fpIndex, 1);
            // 如果删除的歌曲排在当前播放歌曲前面，那么 currentIndex--，让当前的歌正常播放
            if (fpIndex < state.currentIndex) state.currentIndex--;
            // 在 sequencePlayList 中直接删除歌曲即可
            const fsIndex = findIndex(action.payload, state.sequencePlayList);
            state.sequencePlayList.splice(fsIndex, 1);
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSongDetailRequest.fulfilled, (state, action) => {
                let song = action.payload;
                // 找到歌曲下标
                let fpIndex = findIndex(song, state.playList);
                // 如果是当前歌曲直接不处理，歌单内已有该歌曲且正直播放
                if (fpIndex === state.currentIndex && state.currentIndex !== -1) {
                    state = state;
                    return;
                }
                // 添加新歌曲
                state.currentIndex++;
                // 把歌放进去,放到当前播放曲目的下一个位置
                state.playList.splice(state.currentIndex, 0, song);
                // 如果列表中已经存在要添加的歌oldSong
                if (fpIndex > -1) {
                    // 如果oldSong的索引在目前播放歌曲的索引小，那么删除它，同时当前index要减一
                    if (state.currentIndex > fpIndex) {
                        state.playList.splice(fpIndex, 1);
                        state.currentIndex--;
                    } else {
                        // 否则直接删掉oldSong
                        state.playList.splice(fpIndex + 1, 1);
                    }
                }
                // 同理，处理sequencePlayList
                let sequenceIndex = findIndex(state.playList[state.currentIndex], state.sequencePlayList) + 1;
                let fsIndex = findIndex(song, state.sequencePlayList);
                // 插入歌曲
                state.sequencePlayList.splice(sequenceIndex, 0, song);
                if (fsIndex > -1) {
                    //跟上面类似的逻辑。如果在前面就删掉，index--;如果在后面就直接删除
                    if (sequenceIndex > fsIndex) {
                        state.sequencePlayList.splice(fsIndex, 1);
                        sequenceIndex--;
                    } else {
                        state.sequencePlayList.splice(fsIndex + 1, 1);
                    }
                }
            })
    }
})

export const selectLoading = (state) => state.player.loading;
export const selectFullScreen = (state) => state.player.fullScreen;
export const selectPlaying = (state) => state.player.playing;
export const selectCurrentIndex = (state) => state.player.currentIndex;
export const selectPlayList = (state) => state.player.playList;
export const selectCurrentSong = (state) => state.player.currentSong;
export const selectMode = (state) => state.player.mode;
export const selectSequencePlayList = (state) => state.player.playList;
export const selectShowPlayList = (state) => state.player.showPlayList;

export const {
    changeCurrentSong,
    changeFullScreen,
    changePlayingState,
    changeSequecePlayList,
    changePlayList,
    changePlayMode,
    changeCurrentIndex,
    changeShowPlayList,
    deletesong
} = playerSlice.actions;

export default playerSlice.reducer;