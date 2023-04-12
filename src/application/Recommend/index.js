import React, { memo, useState, useRef, useEffect } from 'react';
import { forceCheck } from 'react-lazyload';
import { useSelector, useDispatch } from "react-redux";
import { renderRoutes } from 'react-router-config';

import {
    fetchBannerList,
    fetchRecommendList,
    selectAllBanners,
    selectAllRecommendList,
    selectEnterLoading
} from './recommendSlice';
import {
    selectPlayList
} from '../Player/playerSlice'

import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll/index';
import Loading from '../../baseUI/loading';

import { Content } from './style';

export default memo(function Recommend(props) {

    const dispatch = useDispatch();
    const songsCount = useSelector(selectPlayList);
    const bannerList = useSelector(selectAllBanners);
    const recommendList = useSelector(selectAllRecommendList)
    const enterLoading = useSelector(selectEnterLoading)

    const [start, setStart] = useState(0);  // 开始索引
    const [end, setEnd] = useState(9);    // 结束索引
    const scrollTopRef = useRef();         // 保存scrollTop
    const listRef = useRef();               // 列表容器的ref


    // 监听滚动事件，更新startIndex和endIndex
    const handleScroll = () => {
        const bScorll = scrollTopRef.current.getBScroll()
        console.log(-bScorll.y);
        const startIndex = Math.max(Math.floor((-bScorll.y) / 120) * 3, 0);
        const endIndex = Math.min(startIndex + 9, recommendList.length);
        if (endIndex < end) return;
        console.log(startIndex, endIndex);
        setEnd(endIndex);
        forceCheck()
    };


    useEffect(() => {
        if (!bannerList.length || !bannerList.length) {
            dispatch(fetchBannerList());
            dispatch(fetchRecommendList());
        }
    }, [])

    return (
        <Content
            play={songsCount.length}
            ref={listRef}
            style={{ height: '580px', overflowY: 'scroll' }}
        >
            <Scroll onScroll={handleScroll} ref={scrollTopRef} >
                <div>
                    <Slider bannerList={bannerList}></Slider>
                    <RecommendList recommendList={recommendList.slice(start, end)} />
                </div>
            </Scroll>
            {enterLoading ? <Loading></Loading> : null}
            {renderRoutes(props.route.routes)}
        </Content>
    )
})
