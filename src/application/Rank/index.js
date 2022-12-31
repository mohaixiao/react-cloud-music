import React, { memo, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { renderRoutes } from 'react-router-config';

import Loading from '../../baseUI/loading';
import Scroll from '../../baseUI/scroll/index';


import { fetchRankList, selectLoading, selectRankList } from './rankSlice';
import { filterIndex } from '../../api/utils';

import { EnterLoading } from './../Singers/style';

import {
    List,
    ListItem,
    SongList,
    Container
} from './style';

export default memo(function Rank(props) {

    const dispatch = useDispatch();
    const rankList = useSelector(selectRankList);
    const loading = useSelector(selectLoading);

    let globalStartIndex = filterIndex(rankList);
    let officialList = rankList.slice(0, globalStartIndex);
    let globalList = rankList.slice(globalStartIndex);

    // 切换榜单详情页面
    const enterDetail = (detail) => {
        props.history.push(`/rank/${detail.id}`)
    }

    useEffect(() => {
        dispatch(fetchRankList());
        // eslint-disable-next-line
    }, []);

    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
                    })
                }
            </SongList>
        ) : null;
    }

    const renderRankList = (list, global) => {
        return (
            <List globalRank={global}>
                {
                    list.map((item) => {
                        return (
                            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item)}>
                                <div className="img_wrapper">
                                        <img src={item.coverImgUrl} alt="" />
                                    <div className="decorate"></div>
                                    <span className="update_frequecy">{item.updateFrequency}</span>
                                </div>
                                {renderSongList(item.tracks)}
                            </ListItem>
                        )
                    })
                }
            </List >
        )
    }

    let displayStyle = loading ? { "display": "none" } : { "display": "" };

    return (
        <Container>
            <Scroll>
                <div>
                    <h1 className="offical" style={displayStyle}>官方榜</h1>
                    {renderRankList(officialList)}
                    <h1 className="global" style={displayStyle}>全球榜</h1>
                    {renderRankList(globalList, true)}
                    {loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Container>
    );
})
