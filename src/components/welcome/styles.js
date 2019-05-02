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
    opacity: .6,
    background: props.primaryColor
}))

export const WelcomeFlexContainer = styled.div`
    label: welcome-container;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-content: space-around;
    color: white;
    height: 100%;
    width: 100%;
`

export const WelcomeTextContainer = styled.div`
    label: welcome-content;
    background-color: rgba(0,0,0,0.33);
    text-align: center;
    margin: auto;
    padding-bottom: 50px;
    width: 82%;
    max-width: 500px;
`

export const WelcomeFooterContainer = styled.div`
    label: footer;
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
    margin: 0 auto;`
