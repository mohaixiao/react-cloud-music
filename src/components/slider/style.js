import styled from "styled-components";
import style from '../../assets/global-style'

export const SliderContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: auto;
  background: white;
  /* 顶部红色阴影拉长 */
    .before {
    position: absolute;
    top: -300px;
    height: 400px;
    width: 100%;
    background: ${style["theme-color"]};
  }

  .slider-container {
    position: relative;
    width: 98%;
    height: 160px;
    overflow: hidden;
    margin: auto;
    border-radius: 6px;
    /* current bullet */
    .swiper-pagination-bullet-active {
      background: ${style["theme-color"]};
    }
  }
`