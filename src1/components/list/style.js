import styled from 'styled-components'
import style from '../../assets/global-style'

// 全部表格样式
export const ListWrapper = styled.div`
    max-width: 100%;
    .title {
        font-weight: 700;
        padding-left: 6px;
        font-size: 14px;
        line-height: 60px;
        color: ${style["font-color"]};
    }
`;
// 列表样式
export const List = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
`;
// 单个表格
export const ListItem = styled.div`
position: relative;
width: 32%;
.img_wrapper {
    // 图片阴影遮罩
    .decorate {
        position: absolute;
        top: 0;
        width: 100%;
        height: 35px;
        border-radius: 3px;
        background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
        z-index: 1;
    }
    position: relative;
    height: 0;
    padding-bottom: 100%;
    // 播放数据字体样式
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]}!important;
      z-index: 1;
      .play{
        vertical-align: top;
      }
    }
    // 图片样式
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
}
// 歌曲标题样式
.desc {
    overflow: hidden;
    margin-top: 2px;
    padding: 0 2px;
    height: 50px;
    text-align: left;
    font-size: ${style["font-size-s"]};
    line-height: 1.4;
    color: ${style["font-color-desc"]};
}
`;