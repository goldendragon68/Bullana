import { ContainerFluid, Div, LinkBase } from "components/base";
import styled from "styled-components";


interface BackgroundImageDivProps {
    imageUrl: string;
}

export const BackgroundImageDiv = styled(Div) <BackgroundImageDivProps>`
  width: 100%;
  height: 100vh;
  background-image: url(${props => props.imageUrl});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

export const BrandTitle = styled(Div)``;
BrandTitle.defaultProps = {
    fontSize: "12px",
    textAlign: "center",
    fontWeight: "600",
    color: "white",
    lineHeight: "14.95px",
    letterSpacing: "1.95px"
};

export const BrandLink = styled(LinkBase)``;
BrandLink.defaultProps = {
    px: "1em",
    fontWeight: "500",
    fontSize: "12px",
    fontStyle: "italic",
    lineHeight: "16px",
    letterSpacing: "0.02em",
    textAlign: "center"
};

export const BottomLink = styled(LinkBase)``;
BottomLink.defaultProps = {
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "20px",
    color: "color_2"
};

export const BottomTag = styled(Div)``;
BottomTag.defaultProps = {
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "20px",
};

export const LeftBorderDiv = styled(ContainerFluid)`
    border-left: 1px solid;
    border-image-source: linear-gradient(180deg, rgba(121, 92, 40, 0.03) 0%, #DFAA4A 47.5%, rgba(121, 92, 40, 0.03) 100%);
    border-image-slice: 1;
    border-image-width: 1;
    border-image-repeat: stretch;
}
`;

export const FilterDiv = styled(ContainerFluid)`
    position: fixed;
    bottom: 0;
    height: 50vh;
    width: -webkit-fill-available;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) -3.34%, #000000 100%);
    z-index: 0;
}
`;

export const BullanaTitle = styled(Div)``;
BullanaTitle.defaultProps = {
    fontFamily: "Gibson",
    fontWeight: "600",
    fontSize: "23px",
    lineHeight: "28.8px",
    letterSpacing: "0.07em",
    textAlign: "left"
};

export const WelcomeTitle = styled(Div)``;
WelcomeTitle.defaultProps = {
    fontFamily: "Arial",
    fontWeight: "700",
    fontSize: "40px",
    lineHeight: "46px",
    letterSpacing: "2px",
    textAlign: "left"
};

export const HeaderTitle = styled(Div)``;
HeaderTitle.defaultProps = {
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "20px",
    textAlign: "left"
};


export const NavLink = styled(LinkBase)``;
NavLink.defaultProps = {
    fontWeight: "700",
    fontSize: "16px",
    lineHeight: "14px",
    letterSpacing: "1.7px",
};



export const Title700 = styled(Div)``;
Title700.defaultProps = {
    fontWeight: "700",
    fontSize: "20px",
};
