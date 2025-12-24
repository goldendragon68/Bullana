import { Container, ContainerFluid, Div, Image } from "components/base";
import { BackgroundImageDiv, BrandLink, BrandTitle, FilterDiv } from "../../components/elements/element.box"

const LoginLogo = () => {

  return (
    <BackgroundImageDiv imageUrl={require(`assets/image/bg.png`)}
      alignItems={"center"}
      justifyContent={"flex-end"}
      flexDirection={"column"}
      backgroundColor={"bg_1"}
    >
      <FilterDiv/>
      <ContainerFluid zIndex={1}>
        <Image src={require(`assets/image/group.png`)} height={"3em"} mb={"1em"} />
        <BrandTitle>©2023 ROLL.GAME <br />ALL RIGHTS RESERVED</BrandTitle>
        <Div flexDirection={"row"} my={"2.5em"}>
          <BrandLink href={"https://discord.gg/A9dvSWFu"}
            target={"_blank"} >
            DISCORD
          </BrandLink>
          <BrandLink href={"https://x.com/bullanabet"}
            target={"_blank"} >
            X(TWITTER)
          </BrandLink>
          <BrandLink href={"#"} >
            TELEGRAM
          </BrandLink>
          <BrandLink href={"#"} >
            INSTAGRAM
          </BrandLink>
        </Div>
      </ContainerFluid>
    </BackgroundImageDiv>
  );
};

export default LoginLogo;
