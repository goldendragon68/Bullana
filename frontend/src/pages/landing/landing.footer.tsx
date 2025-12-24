import { ContainerFluid, Div, Image } from "components/base";
import { IconMark } from "components/icons";
import { styled } from "styled-components";

const FooterTitle = styled(Div)``;
FooterTitle.defaultProps = {
  fontSize: "12px",
  fontWeight: "400",
  lineHeight: "14px",
  letterSpacing: "1.5px",
  textAlign: "center",
  color: "color_4"
};


const FooterCopyTitle = styled(FooterTitle)``;
FooterCopyTitle.defaultProps = {
  fontWeight: "700",
};


const LandingFooter = () => {

  return (
    <ContainerFluid
      py={"4em"}
    >
      <IconMark
        size="3.5em" />
      <FooterTitle maxWidth={"700px"} mt={"2em"}>
        A multi-award winning crypto casino. With a player-centric approach, ROLL.GAME is able to satisfy millions of gamblers across the globe. ROLL.GAME has its priority set on its community, ensuring an everlasting and endlessly entertaining gambling experience.</FooterTitle>
      <FooterCopyTitle  mt={"2em"}>©2023 ROLL.GAME ALL RIGHTS RESERVED</FooterCopyTitle>
    </ContainerFluid>
  );
};

export default LandingFooter;
