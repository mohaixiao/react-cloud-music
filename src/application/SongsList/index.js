import React from 'react';
import { useSelector, useDispatch } from "react-redux";

import { getName } from '../../api/utils';
import {
  changePlayList,
  changeCurrentIndex,
  changeSequecePlayList
} from '../Player/playerSlice'

import { SongList, SongItem } from "./style";


const SongsList = React.forwardRef((props, refs) => {

  const { collectCount, showCollect, songs } = props;
  // 接受触发动画的函数
  const { musicAnimation } = props;

  const totalCount = songs.length;
  const dispatch = useDispatch();
  const selectItem = (e, index) => {
    // 存入歌单
    dispatch(changePlayList(songs));
    // 存入顺序列表
    dispatch(changeSequecePlayList(songs));
    // 存入歌曲下标
    dispatch(changeCurrentIndex(index));
    // 执行icon播放动画
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }

  let songList = (list) => {
    let res = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };

  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count / 1000) / 10}万)</span>
      </div>
    )
  };

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>播放全部 <span className="sum">(共{totalCount}首)</span></span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        {songList(songs)}
      </SongItem>
    </SongList>
  )
});


export default React.memo(SongsList);