import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

export const BackgroundImage = styled.div((props) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    zIndex: -5,
    opacity: props.opacity,
    backgroundImage: `url(${props.url})`,
}));

export const BackgroundImageTint = styled.div((props) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -4,
    opacity: 0.6,
    background: props.background,
}));

export const LogoContainer = styled.div`
    text-align: center;
    margin-top: 20px;
`;

export const WelcomeFlexContainer = styled.div`
    label: welcome__container;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-content: space-around;
    color: white;
    height: 100%;
    width: 100%;
`;

export const WelcomeTextContainer = styled.div`
    label: welcome__content;
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
    margin: auto;
    padding-bottom: 50px;
    width: 82%;
    max-width: 500px;
    position: relative;
`;

export const WelcomeFooterContainer = styled.div`
    label: welcome__footer;
    margin: 2% 10%;
    height: 15%;
    text-align: center;
`;

export const HomeImageContainer = styled.div`
    position: relative;
    top: -40px;
    width: 30px;
    height: 30px;
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;
    background: inherit;
    text-align: center;
    padding: 10px 10px 0 10px;
    margin: 0 auto;
`;

export const CallToActionButton = withStyles({
    root: {
        background: '#FFF',
        borderRadius: 21.5,
        color: 'black',
        '&:hover': {
            background: '#CCC',
        },
        height: '43px',
    },
    label: {
        textTransform: 'none',
        fontFamily: 'proxima-nova, sans-serif',
    },
})(Button);
