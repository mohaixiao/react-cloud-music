import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from './../../api/utils';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress{
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn{
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`

function ProgressBar(props) {
  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();
  const [touch, setTouch] = useState({});

  const { percent } = props;

  const { percentChange } = props;

  const progressBtnWidth = 16;

  const transform = prefixStyle('transform');

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      // 总长度
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      // 当前进度条长度
      const offsetWidth = percent * barWidth;
      // 进度条长度
      progress.current.style.width = `${offsetWidth}px`;
      // 按钮移动
      progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
    // eslint-disable-next-line
  }, [percent]);

  const _changePercent = () => {
    // 进度条总长度
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    // 当前进度条长度
    const curPercent = progress.current.clientWidth / barWidth;
    // 回调函数
    percentChange(curPercent);
  }

  // 处理进度条的偏移
  const _offset = (offsetWidth) => {
    // 进度条长度
    progress.current.style.width = `${offsetWidth}px`;
    // 按钮移动
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const progressClick = (e) => {
    // 进度条距离浏览器边框左边的距离
    const rect = progressBar.current.getBoundingClientRect();
    // 鼠标点击位置（e.pageX) 减去 得到进度条长度
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    _changePercent();
  };

  const progressTouchStart = (e) => {
    const startTouch = {};
    //initial为true表示滑动动作开始了
    startTouch.initiated = true;
    // 滑动开始时横向坐标
    startTouch.startX = e.touches[0].pageX;
    // 当前 progress 长度
    startTouch.left = progress.current.clientWidth;
    setTouch(startTouch);
  };

  const progressTouchMove = (e) => {
    if (!touch.initiated) return;
    //滑动距离   
    const deltaX = e.touches[0].pageX - touch.startX;
    // 进度条总长度
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    // 0-barWidth之间 当前进度条长度
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };

  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch));
    // 改变initial初始值
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick} >
        <div className="progress" ref={progress}></div>
        <div className="progress-btn-wrapper" ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default ProgressBar;