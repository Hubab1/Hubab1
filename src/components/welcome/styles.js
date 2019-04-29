import styled from '@emotion/styled';


export const BackgroundImage = styled.div( props => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    zIndex: -5,
    backgroundImage: `url(${props.url})`,
}))

export const BackgroundImageTint = styled.div( props => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -4,
    opacity: .5,
    background: props.primaryColor
}))

export const WelcomeFlexContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-content: space-around;
    height: 100%;
    width: 100%;
`

export const WelcomeContainer = styled.div`
    background-color: rgba(0,0,0,0.33);
    text-align: center;
    margin: auto;
    font-family: sans-serif;
    color: #FFFFFF;
    padding: 0 50px 50px 50px;
    max-width: 500px;
`

export const WelcomeLogo = styled.div`
    margin-top: 20px;
    width: 150px;
    margin: auto;
`

export const WelcomeTitle = styled.div`
    font-family: "Proxima Nova";
    font-size: 25px;
    line-height: 30px;
    text-align: center;
    padding-bottom: 20px;
`

export const WelcomeInfo = styled.div`
    color: #FFFFFF;
    font-family: "Proxima Nova";
    font-size: 22px;
    line-height: 30px;
    text-align: center;
`

export const WelcomeInfoTitle = styled.div`
    color: #FFFFFF;
    font-weight: 600;
    font-family: "Proxima Nova";
    font-size: 22px;
    line-height: 30px;
    text-align: center;
    padding-top: 15px;
`

export const WelcomeFooterContainer = styled.div`
    margin: 2% 10%;
    height: 15%;
    text-align: center;
`

export const HomeImageContainer = styled.div`
    position: relative;
    top: -35px;
    width: 30px;
    height: 15px;
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;
    background: inherit;
    text-align: center;
    padding: 10px;
    margin-left: 38%;
`
