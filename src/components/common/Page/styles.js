import { css } from 'emotion';
import styled from '@emotion/styled';

export const page = css`
  text-align: center;
  max-width: 900px;
  margin: auto;
  padding-bottom: 25px;
`

export const subPage = `subPage ${css`
    padding: 30px 20px;
    height: 500px;
`}`

export const Banner = styled.div`
  height: 92px;
  box-shadow: 0 2px 4px 0 rgba(177,181,189,0.4);
  padding-top: 5px;
  padding-bottom: 10px;
  font-size: 30px;
  text-align: center;
`
