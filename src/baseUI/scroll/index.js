import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from "react"
import BScroll from "better-scroll"
import PropTypes from "prop-types"

import { debounce } from "../../api/utils";


import Loading from '../loading';
import LoadingV2 from '../loading-v2';

import { ScrollContainer, PullUpLoading, PullDownLoading } from './style'


const Scroll = forwardRef((props, ref) => {
    //better-scroll 实例对象
    const [bScroll, setBScroll] = useState();
    //current 指向初始化 bs 实例需要的 DOM 元素 
    const scrollContaninerRef = useRef();

    const { direction, click, refresh, bounceTop, bounceBottom } = props;

    const { pullUp, pullDown, onScroll, pullUpLoading, pullDownLoading } = props;

    const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
    const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };

    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp]);


    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown]);

    // 创建 better-scroll
    useEffect(() => {
        const scroll = new BScroll(scrollContaninerRef.current, {
            scrollX: direction === "horizental", // false
            scrollY: direction === "vertical", // true
            // probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
            probeType: 3,
            click: click,
            // 回弹动画
            bounce: {
                top: bounceTop,
                bottom: bounceBottom,
            }
        })
        setBScroll(scroll);
        // 组件卸载删除scroll
        return () => {
            setBScroll(null);
        }
        // eslint-disable-next-line
    }, [])

    // 每次重新渲染都要刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });

    // 给实例绑定 scroll 事件
    useEffect(() => {
        if (!onScroll || !bScroll) return;
        bScroll.on('scroll', (position) => {
            onScroll(position)
        })
        return () => {
            bScroll.off('scroll')
        }
    }, [onScroll, bScroll])

    // 进行上拉到底的判断，调用上拉刷新的函数
    useEffect(() => {
        if (!pullUp || !bScroll) return;
        //判断是否滑动到了底部
        // 触发时机：用户手指离开滚动区域
        bScroll.on('scrollEnd', () => {
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce()
            }
        })
        return () => {
            bScroll.off('scrollEnd');
        }
    }, [pullUpDebounce, pullUp, bScroll])

    // 进行下拉的判断，调用下拉刷新的函数
    useEffect(() => {
        if (!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos) => {
            if (pos.y > 50) {
                pullDownDebounce();
            }
        })
        return () => {
            bScroll.off('touchEnd');
        }
    }, [pullDown, pullDownDebounce, bScroll])

    useImperativeHandle(ref, () => ({
        // 给外界暴露 refresh 方法
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        // 给外界暴露 getBScroll 方法，提供 bs 实例
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));

    return (
        <ScrollContainer ref={scrollContaninerRef}>
            {props.children}
            {/* 滑到底部加载动画 */}
            <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
            {/* 顶部下拉刷新动画 */}
            <PullDownLoading style={PullDowndisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    )
})

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};

Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizental']),// 滚动的方向
    click: true,// 是否支持点击

    refresh: PropTypes.bool,// 是否刷新API
    onScroll: PropTypes.func,// 滑动触发的回调函数

    pullUp: PropTypes.func,// 上拉加载逻辑
    pullDown: PropTypes.func,// 下拉加载逻辑
    pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool,//是否支持向上吸顶
    bounceBottom: PropTypes.bool//是否支持向上吸顶
};

export default Scroll;