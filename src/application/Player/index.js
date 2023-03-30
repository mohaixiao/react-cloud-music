
import React, { memo, useState, useRef, useEffect, } from 'react'
import { useSelector, useDispatch } from "react-redux";

import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import Toast from "../../baseUI/toast/index";
import PlayList from './play-list/index';

import { getSongUrl, isEmptyObject, shuffle, findIndex } from "../../api/utils";
import { playMode } from '../../api/config';
import { getLyricRequest } from "../../api/request";
import Lyric from './../../api/lyric-parser';


import {
    selectFullScreen,
    selectCurrentIndex,
    changeFullScreen,
    selectPlaying,
    changeShowPlayList,
    changeCurrentIndex,
    changePlayingState,
    changeCurrentSong,
    changePlayMode,
    changePlayList,
    selectPlayList,
    selectCurrentSong,
    selectMode,
    selectSequencePlayList,
} from './playerSlice';

const Player = memo((props) => {


    //目前播放时间
    const [currentTime, setCurrentTime] = useState(0);
    //歌曲总时长
    const [duration, setDuration] = useState(0);
    //歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
    //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
    const [preSong, setPreSong] = useState({});
    const [modeText, setModeText] = useState("");
    // 歌词txt
    const [currentPlayingLyric, setPlayingLyric] = useState("");

    const audioRef = useRef();
    const songReady = useRef(true);
    const toastRef = useRef();
    const currentLyric = useRef();
    const currentLineNum = useRef(0);

    const dispatch = useDispatch();
    const fullScreen = useSelector(selectFullScreen);
    const playing = useSelector(selectPlaying)
    const currentIndex = useSelector(selectCurrentIndex);
    const playList = useSelector(selectPlayList);
    const currentSong = useSelector(selectCurrentSong);
    const mode = useSelector(selectMode);
    const sequencePlayList = useSelector(selectSequencePlayList);

    // 改变全屏
    const toggleFullScreenDispatch = (data) => {
        dispatch(changeFullScreen(data));
    }
    // playlist是否展示
    const togglePlayListDispatch = (data) => {
        dispatch(changeShowPlayList(data));
    }
    // 改变播放状态
    const togglePlayingDispatch = (data) => {
        dispatch(changePlayingState(data));
    }
    // 改变播放状态
    const clickPlaying = (e, state) => {
        e.stopPropagation();
        togglePlayingDispatch(state);
        // 改变歌词播放状态+歌词进度
        if (currentLyric.current) {
            currentLyric.current.togglePlay(currentTime * 1000);
        }
    };

    const updateTime = e => {
        setCurrentTime(e.target.currentTime);
    };

    // 改变进度
    const onProgressChange = curPercent => {
        // 当前时间
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        // 更新播放当前时间
        audioRef.current.currentTime = newTime;
        // 改变播放状态为true
        if (!playing) {
            togglePlayingDispatch(true);
        }
        // 改变播放歌词进度
        if (currentLyric.current) {
            currentLyric.current.seek(newTime * 1000);
          }
    };

    //一首歌循环
    const handleLoop = () => {
        audioRef.current.currentTime = 0;
        changePlayingState(true);
        audioRef.current.play();
    };
    // 上一首
    const handlePrev = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex - 1;
        if (index < 0) index = playList.length - 1;
        if (!playing) togglePlayingDispatch(true);
        dispatch(changeCurrentIndex(index));
    };

    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            //顺序模式
            dispatch(changePlayList(sequencePlayList));
            let index = findIndex(currentSong, sequencePlayList);
            dispatch(changeCurrentIndex(index));
            setModeText("顺序循环");
        } else if (newMode === 1) {
            //单曲循环
            dispatch(changePlayList(sequencePlayList));
            setModeText("单曲循环");
        } else if (newMode === 2) {
            //随机播放
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            dispatch(changePlayList(newList));
            dispatch(changeCurrentIndex(index));
            setModeText("随机播放");
        }
        dispatch(changePlayMode(newMode));
        toastRef.current.show();
    };
    // 下一首
    const handleNext = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex + 1;
        if (index === playList.length) index = 0;
        if (!playing) togglePlayingDispatch(true);
        dispatch(changeCurrentIndex(index));
    };

    const handleError = () => {
        songReady.current = true;
        alert("播放出错");
    };

    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop();
        } else {
            handleNext();
        }
    };

    const handleLyric = ({ lineNum, txt }) => {
        if (!currentLyric.current) return;
        currentLineNum.current = lineNum;
        setPlayingLyric(txt);
    };

    const getLyric = id => {
        let lyric = "";
        if (currentLyric.current) {
            currentLyric.current.stop();
        }
        // 避免songReady恒为false的情况
        setTimeout(() => {
            songReady.current = true;
        }, 3000);
        getLyricRequest(id)
            .then(data => {
                // 请求的歌词
                lyric = data.lrc.lyric;

                // 歌词不存在
                if (!lyric) {
                    currentLyric.current = null;
                    return;
                }
                // 创建歌词对象
                currentLyric.current = new Lyric(lyric, handleLyric);
                // 找到行数 进行回调 使用_playRest递归进行回调
                currentLyric.current.play();
                // 初始化行数
                currentLineNum.current = 0;
                // 播放起点
                currentLyric.current.seek(0);
            })
            .catch(() => {
                songReady.current = true;
                audioRef.current.play();
            });
    };



    useEffect(() => {
        if (
            !playList.length ||
            currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id ||
            !songReady.current
        )
            return;
        let current = playList[currentIndex];
        dispatch(changeCurrentSong(current));//赋值currentSong
        setPreSong(current);
        songReady.current = false;
        audioRef.current.src = getSongUrl(current.id);
        setTimeout(() => {
            audioRef.current.play().then(() => {
                songReady.current = true;
            });
        });
        togglePlayingDispatch(true);//播放状态
        setCurrentTime(0);//从头开始播放
        setDuration((current.dt / 1000) | 0);//时长
        getLyric(current.id); // 获取歌词
    }, [playList, currentIndex]);

    useEffect(() => {
        playing ? audioRef.current.play() : audioRef.current.pause();
    }, [playing]);

    return (
        <div>
            <div>
                {
                    isEmptyObject(currentSong) ? null :
                        <MiniPlayer
                            playing={playing}
                            percent={percent}
                            song={currentSong}
                            clickPlaying={clickPlaying}
                            fullScreen={fullScreen}
                            toggleFullScreen={toggleFullScreenDispatch}
                            togglePlayList={togglePlayListDispatch}
                            duration={duration}//总时长
                            currentTime={currentTime}//播放时间
                        />
                }
                {
                    isEmptyObject(currentSong) ? null :
                        <NormalPlayer
                            playing={playing}
                            percent={percent}
                            song={currentSong}
                            clickPlaying={clickPlaying}
                            fullScreen={fullScreen}
                            toggleFullScreen={toggleFullScreenDispatch}
                            togglePlayList={togglePlayListDispatch}
                            duration={duration}//总时长
                            currentTime={currentTime}//播放时间
                            onProgressChange={onProgressChange}
                            handlePrev={handlePrev}
                            handleNext={handleNext}
                            mode={mode}
                            changeMode={changeMode}
                            currentLyric={currentLyric.current}
                            currentPlayingLyric={currentPlayingLyric}
                            currentLineNum={currentLineNum.current}
                        />
                }

                <audio
                    ref={audioRef}
                    onTimeUpdate={updateTime}
                    onError={handleError}
                    onEnded={handleEnd}
                ></audio>
                <PlayList></PlayList>
                <Toast text={modeText} ref={toastRef}></Toast>
            </div>
        </div>
    )
})

export default Player