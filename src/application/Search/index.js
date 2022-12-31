import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from "react-redux";
import LazyLoad, { forceCheck } from 'react-lazyload';

import SearchBox from './../../baseUI/search-box/index';
import Scroll from '../../baseUI/scroll';
import Loading from './../../baseUI/loading/index';
import MusicalNote from '../../baseUI/music-note';

import { getName } from '../../api/utils';
import {
    selectEnterLoading,
    selectHotList,
    selectSongsList,
    selectSuggestList,
    changeEnterLoading,
    fetchHotKeyWords,
    fetchResultSongsList,
    fetchSuggestList
} from './searchSlice'
import {
    fetchSongDetailRequest,
    selectPlayList
} from '../Player/playerSlice'

import { Container, ShortcutWrapper, HotKey, List, ListItem, SongItem } from './style';

function Search(props) {

    const musicNoteRef = useRef();
    const dispatch = useDispatch();
    const hotList = useSelector(selectHotList);
    const enterLoading = useSelector(selectEnterLoading);
    const suggestList = useSelector(selectSuggestList);
    const songsCount = useSelector(selectPlayList);
    const songsList = useSelector(selectSongsList);

    // 热门推荐
    const renderHotKey = () => {
        let list = hotList || [];
        return (
            <ul>
                {
                    list.map(item => {
                        return (
                            <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                                <span>{item.first}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    };

    const renderSingers = () => {
        let singers = suggestList.artists;
        if (!singers || !singers.length) return;
        return (
            <List>
                <h1 className="title">相关歌手</h1>
                {
                    singers.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="singer" />}>
                                        <img src={item.picUrl} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">歌手: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderAlbum = () => {
        let albums = suggestList.playlists;
        if (!albums || !albums.length) return;
        return (
            <List>
                <h1 className="title">相关歌单</h1>
                {
                    albums.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => props.history.push(`/album/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music" />}>
                                        <img src={item.coverImgUrl} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">歌单: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderSongs = () => {
        return (
            <SongItem style={{ paddingLeft: "20px" }} >
                {
                    songsList.map(item => {
                        return (
                            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                                <div className="info">
                                    <span>{item.name}</span>
                                    <span>
                                        {getName(item.artists)} - {item.album.name}
                                    </span>
                                </div>
                            </li>
                        )
                    })
                }
            </SongItem>
        )
    };

    const selectItem = (e, id) => {
        dispatch(fetchSongDetailRequest(id));
        musicNoteRef.current.startAnimation({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
    }

    // 控制动画
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
        if (!hotList.length)
            dispatch(fetchHotKeyWords());
    }, []);

    // 组件内部
    const [query, setQuery] = useState('');

    // 由于是传给子组件的方法，尽量用 useCallback 包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
    const searchBack = useCallback(() => {
        setShow(false);
    }, []);

    const handleQuery = (q) => {
        setQuery(q);
        if (!q) return;
        dispatch(changeEnterLoading(true));
        dispatch(fetchSuggestList(q));
        dispatch(fetchResultSongsList(q))
    }
    return (
        <CSSTransition
            in={show}
            timeout={300}
            appear={true}
            classNames="fly"
            unmountOnExit
            onExited={() => props.history.goBack()}
        >
            <Container play={songsCount.length}>
                <div className="search_box_wrapper">
                    <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
                </div>
                <ShortcutWrapper show={!query}>
                    <Scroll>
                        <div>
                            <HotKey>
                                <h1 className="title">热门搜索</h1>
                                {renderHotKey()}
                            </HotKey>
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                <ShortcutWrapper show={query}>
                    <Scroll onScorll={forceCheck}>
                        <div>
                            {renderSingers()}
                            {renderAlbum()}
                            {renderSongs()}
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                {enterLoading ? <Loading></Loading> : null}
                <MusicalNote ref={musicNoteRef}></MusicalNote>
            </Container>
        </CSSTransition>
    )
}

export default Search;