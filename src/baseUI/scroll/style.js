import styled from "styled-components";

// Scroll样式
export const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

// 上拉loading
export const PullUpLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    width: 60px;
    height: 60px;
    margin: auto;
    bottom: 5px;
    z-index: 100;
`;


// 下拉loading
export const PullDownLoading = styled.div`
  position: absolute;
  left:0;
  right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;
