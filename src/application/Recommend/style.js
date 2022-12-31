import styled from 'styled-components';

// scroll外部样式限制
export const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
`