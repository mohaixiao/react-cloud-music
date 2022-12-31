import React, { memo, useState, useEffect, useRef, useCallback } from 'react'
import { CSSTransition } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";

import Header from "../../baseUI/header/index";
import Scroll from "../../baseUI/scroll/index";
import SongsList from "../SongsList";
import Loading from "./../../baseUI/loading/index";
import MusicNote from "../../baseUI/music-note/index";

import { HEADER_HEIGHT } from "./../../api/config";
import {
    changeArtist,
    changeLoading,
    changeSongsOfArtist,
    fetchSingerInfo,
    selectArtist,
    selectEnterLoading,
    selectSongsOfArtist
} from './singerSlice'
import {
    selectPlayList
} from '../Player/playerSlice'
import { Container, BgLayer, ImgWrapper, CollectButton, SongListWrapper } from "./style";

export default memo(function Singer(props) {

    const [showStatus, setShowStatus] = useState(true);
    const dispatch = useDispatch();
    const setShowStatusFalse = useCallback(() => {
        setShowStatus(false);
    }, []);

    const songsCount = useSelector(selectPlayList);
    const artist = useSelector(selectArtist);
    const songs = useSelector(selectSongsOfArtist);
    const loading = useSelector(selectEnterLoading);
    const id = props.match.params.id;


    const collectButton = useRef();
    const imageWrapper = useRef();
    const songScrollWrapper = useRef();
    const songScroll = useRef();
    const header = useRef();
    const layer = useRef();
    const musicNoteRef = useRef();

    // 图片初始高度
    const initialHeight = useRef(0);

    // 往上偏移的尺寸，露出圆角
    const OFFSET = 5;

    useEffect(() => {
        let h = imageWrapper.current.offsetHeight;
        initialHeight.current = h;
        songScrollWrapper.current.style.top = `${h - OFFSET}px`;
        //把遮罩先放在下面，以裹住歌曲列表
        layer.current.style.top = `${h - OFFSET}px`;
        songScroll.current.refresh();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        dispatch(changeLoading(true));
        dispatch(fetchSingerInfo(id));
    }, [id])

    const handleScroll = useCallback(pos => {
        let height = initialHeight.current;
        const newY = pos.y;
        const imageDOM = imageWrapper.current;
        const buttonDOM = collectButton.current;
        const headerDOM = header.current;
        const layerDOM = layer.current;
        // 上划高度限制
        const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

        //指的是滑动距离占图片高度的百分比
        const percent = Math.abs(newY / height);

        // 处理往下拉的情况，效果：图片放大，按钮跟着偏移
        if (newY > 0) {
            imageDOM.style["transform"] = `scale(${1 + percent})`;
            buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
            layerDOM.style.top = `${height - OFFSET + newY}px`;
        } else if (newY >= minScrollY) { // 往上滑动，但是遮罩还没超过 Header 部分
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
            //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
            layerDOM.style.zIndex = 1;
            imageDOM.style.paddingTop = "75%";
            imageDOM.style.height = 0;
            imageDOM.style.zIndex = -1;
            //按钮跟着移动且渐渐变透明 滑动到一半就透明
            buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
            buttonDOM.style["opacity"] = `${1 - percent * 2}`;
        } else if (newY < minScrollY) {
            //往上滑动，但是超过Header部分
            layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
            layerDOM.style.zIndex = 1;
            //防止溢出的歌单内容遮住Header
            headerDOM.style.zIndex = 100;
            //此时图片高度与Header一致
            imageDOM.style.height = `${HEADER_HEIGHT}px`;
            imageDOM.style.paddingTop = 0;
            imageDOM.style.zIndex = 99;
        }
    }, [])

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({ x, y });
    };

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={() => props.history.goBack()}
        >
            <Container play={songsCount.length}>
                <Header
                    handleClick={setShowStatusFalse}
                    title={artist.name}
                    ref={header}
                ></Header>
                <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
                    <div className="filter"></div>
                </ImgWrapper>
                <CollectButton ref={collectButton}>
                    <i className="iconfont">&#xe62d;</i>
                    <span className="text">收藏</span>
                </CollectButton>
                <BgLayer ref={layer}></BgLayer>
                <SongListWrapper ref={songScrollWrapper}>
                    <Scroll ref={songScroll} onScroll={handleScroll}>
                        <SongsList
                            songs={songs}
                            musicAnimation={musicAnimation}
                            showCollect={false}
                        ></SongsList>
                    </Scroll>
                </SongListWrapper>
                {loading ? (<Loading></Loading>) : null}
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
    )
})
