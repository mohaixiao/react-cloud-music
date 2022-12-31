import React, { memo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import LazyLoad, { forceCheck } from 'react-lazyload';
import { renderRoutes } from 'react-router-config';

import Scroll from '../../baseUI/scroll';
import Horizen from '../../baseUI/horizen-item'
import Loading from '../../baseUI/loading';


import {
    fetchHotSingerList,
    fetchSingerList,
    selectPageCount,
    selectAllSingerList,
    selectPullUpLoading,
    selectPullDownLoading,
    selectEnterLoading,
    selectAlpha,
    selectCategory,
    changePageCount,
    changePullUpLoading,
    changePullDownLoading,
    changeEnterLoading,
    changeAlpha,
    changeCategory
} from './singersSlice';
import { categoryTypes, alphaTypes } from '../../api/config'

import {
    NavContainer,
    ListContainer,
    List,
    ListItem
} from "./style";

export default memo(function Singers(props) {

    const dispatch = useDispatch();
    const singerList = useSelector(selectAllSingerList);
    const pageCount = useSelector(selectPageCount);
    const enterLoading = useSelector(selectEnterLoading);
    const pullUpLoading = useSelector(selectPullUpLoading);
    const pullDownLoading = useSelector(selectPullDownLoading);
    const alpha = useSelector(selectAlpha);
    const category = useSelector(selectCategory);

    useEffect(() => {
        // 缓存列表数据
        dispatch(fetchHotSingerList(0));
        // eslint-disable-next-line
    }, []);

    // 切换歌手详情页面
    const enterDetail = (id) => {
        props.history.push(`/singers/${id}`);
    };

    let handleUpdateAlpha = (val) => {
        dispatch(changeAlpha(val));
        dispatch(changePageCount(0));
        dispatch(changeEnterLoading(true));
        dispatch(fetchSingerList({ category, alpha: val, pageCount: 0 }));
    }

    let handleUpdateCatetory = (val) => {
        dispatch(changeCategory(val));
        dispatch(changePageCount(0));
        dispatch(changeEnterLoading(true));
        dispatch(fetchSingerList({ category: val, alpha, pageCount: 0 }));
    }

    // 上拉 滑动到最底部刷新部分的处理
    const handlePullUp = () => {
        pullUpRefreshDispatch(category, alpha, pageCount);
    }

    // 滑到最底部刷新部分的处理
    const pullUpRefreshDispatch = (category, alpha, pageCount) => {
        const hot = category === '';
        dispatch(changePullUpLoading(true));
        dispatch(changePageCount(pageCount + 1));
        if (hot) {
            dispatch(fetchHotSingerList(pageCount + 1));
        } else {
            dispatch(fetchSingerList({ category, alpha, pageCount: pageCount + 1 }));
        }
    }

    // 下拉
    const handlePullDown = () => {
        pullDownRefreshDispatch(category, alpha);
    };

    //顶部下拉刷新
    const pullDownRefreshDispatch = (category, alpha) => {
        dispatch(changePageCount(0));
        dispatch(changePullDownLoading(true));
        if (category === '' && alpha === '') {
            dispatch(fetchHotSingerList(0));
        } else {
            dispatch(fetchSingerList({ category, alpha, pageCount: 0 }));
        }
    }

    // 渲染函数，返回歌手列表
    const renderSingerList = () => {
        return (
            <List>
                {
                    singerList.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music" />}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };

    return (
        <div>
            <NavContainer>
                <Horizen
                    list={categoryTypes} title={"分类(默认热门):"}
                    handleClick={(val) => handleUpdateCatetory(val)}
                    oldVal={category}
                >
                </Horizen>
                <Horizen
                    list={alphaTypes}
                    title={"首字母:"}
                    handleClick={val => handleUpdateAlpha(val)}
                    oldVal={alpha}
                >
                </Horizen>
            </NavContainer>
            <ListContainer>
                <Scroll
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                    onScroll={forceCheck}
                >
                    {renderSingerList()}
                </Scroll>
                <Loading show={enterLoading}></Loading>
            </ListContainer>
            {renderRoutes(props.route.routes)}
        </div>

    )
})
