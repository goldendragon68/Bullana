import { Container, ContainerFluid, Div, Image } from "components/base";
import { styled } from "styled-components";
import BannerBg from "../../assets/image/banner.png";
import { LandingBuyBtn } from "components/elements/element.button";
import { useNavigate } from "react-router-dom";

const HeaderWrapper = styled(ContainerFluid)``;
HeaderWrapper.defaultProps = {
  backgroundImage: `url(${BannerBg})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  flexDirection: "column",
  justifyContent: "center",
  height: "555px"
};

const FilterDiv = styled(ContainerFluid)``;
FilterDiv.defaultProps = {
  height: "100%",
  background: "linear-gradient(-90deg, rgba(0, 0, 0, 0) -3.34%, #000000 84.5%)"
};

const IntroTitle = styled(Div)``;
IntroTitle.defaultProps = {
  fontSize: "48px",
  fontFamily: "Arial",
  fontWeight: "700",
  lineHeight: "55px",
  letterSpacing: "2px",
  color: "#F0E6D2",
};

const IntroTitle1 = styled(Div)``;
IntroTitle1.defaultProps = {
  fontSize: "24px",
  fontFamily: "Arial",
  fontWeight: "400",
  lineHeight: "27px",
  letterSpacing: "1.4px",
  color: "color_4",
};

const IntroTitle2 = styled(Div)``;
IntroTitle2.defaultProps = {
  fontSize: "64px",
  fontFamily: "Arial",
  fontWeight: "700",
  lineHeight: "74px",
  letterSpacing: "2px",
  color: "#DCB960",
};




const LandingPageHeader = () => {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate('/register');
  };

  return (
    <HeaderWrapper
      flexDirection={"column"}
    >
      <FilterDiv>
        <Container flexDirection={"column"} justifyContent={"center"} height={"100%"}>
          <IntroTitle>Hello Bull!<br />Welcome aboard</IntroTitle>
          <IntroTitle1 mt={"5px"}>first deposit bonus</IntroTitle1>
          <IntroTitle2 mt={"5px"}>+300% reward</IntroTitle2>
          <LandingBuyBtn onClick={handlePlayNow}>PLAY NOW</LandingBuyBtn>
        </Container>
      </FilterDiv>
    </HeaderWrapper>
  );
};

export default LandingPageHeader;
