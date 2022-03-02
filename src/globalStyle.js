import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-size: 14px;
    font-family: 'Work Sans', sans-serif;
    color: #141414;
  } 

  a {
    color: #141414;
    text-decoration: none;
  }

  h1 {
    font-size: 48px;
  }
`