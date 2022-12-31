import React, { memo, useEffect } from 'react'
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

    useEffect(() => {
        if (!bannerList.length || !bannerList.length) {
            dispatch(fetchBannerList());
            dispatch(fetchRecommendList());
        }
    }, [])

    return (
        <Content play={songsCount.length}>
            <Scroll onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerList}></Slider>
                    <RecommendList recommendList={recommendList}></RecommendList>
                </div>
            </Scroll>
            {enterLoading ? <Loading></Loading> : null}
            {renderRoutes(props.route.routes)}
        </Content>
    )
})
