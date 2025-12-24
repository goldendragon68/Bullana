import { Container, ContainerFluid, Div, Image, LinkBase } from "components/base";
import { styled } from "styled-components";
import SponsorBg from "../../assets/image/sponsorbg.png";

const SponsorTitle = styled(Div)``;
SponsorTitle.defaultProps = {
  fontSize: "15px",
  fontFamily: "Arial",
  fontWeight: "700",
  lineHeight: "14px",
  letterSpacing: "1.5px",
  color: "color_1",
  textAlign: "center",
  textTransform: "uppercase"
};


const LandingSponsor = () => {
  const SponsorWrapper = styled(ContainerFluid)``;
  SponsorWrapper.defaultProps = {
    backgroundImage: `url(${SponsorBg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    flexDirection: "column",
    height: "400px"
  };
  return (
    <SponsorWrapper>
      <Container flexDirection={"column"} pt={["1em", "1em", "2em", "3em"]}>
        <SponsorTitle width={"100%"} justifyContent={"center"} my={["1em", "1em", "2em", "3em"]}>Sponsorship and Gaming Responsibilities</SponsorTitle>
        <Div
          width={"100%"}
          display={"grid"}
          gridTemplateColumns={[
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(5, 1fr)",
          ]}
          justifyItems={"center"}
          alignItems={"center"}
          columnGap={["0.5", "1em", "1em", "2em"]}
          rowGap={["0.5", "1em", "1em", "2em"]}>
          <LinkBase href="#">
            <Image src={require(`assets/image/landing/image1.png`)} />
          </LinkBase>
          <LinkBase href="#">
            <Image src={require(`assets/image/landing/image2.png`)} />
          </LinkBase>
          <LinkBase href="#">
            <Image src={require(`assets/image/landing/image3.png`)} />
          </LinkBase>
          <LinkBase href="#">
            <Image src={require(`assets/image/landing/image4.png`)} />
          </LinkBase>
          <LinkBase href="#">
            <Image src={require(`assets/image/landing/image5.png`)} />
          </LinkBase>
        </Div>
      </Container>
    </SponsorWrapper>
  );
};

export default LandingSponsor;
