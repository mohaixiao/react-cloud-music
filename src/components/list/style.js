import styled from 'styled-components';
import style from '../../assets/global-style';

export const ListWrapper = styled.div`
    max-width: 100%;
    .title {
        padding-left: 6px;
        line-height: 60px;
        font-size: ${style["font-size-m"]};
        font-weight: 700;
        color:${style["font-color-desc"]};
    }
`;

export const List = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
`;

export const ListItem = styled.div`
    position: relative;
    width: 32%;
    .img_wrapper {
        position: relative;
        height: 0;
        padding-bottom: 100%;
        img {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 3px;
        }
        .cover {
            position: absolute;
            top: 0;
            left: 0;
            height: 35px;
            width: 100%;
            border-radius: 3px;
            /* 渐变色 */
            background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
            z-index: 1;
        }
        .play_count {
            position: absolute;
            top: 2px;
            right: 2px;
            z-index: 1;
            font-size: ${style['font-size-s']};
            line-height: 15px;
            color: ${style["font-color-light"]}!important;
            .play{
                vertical-align: top;
            }
            .count{
                vertical-align: top;
            }
        }
    }
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

