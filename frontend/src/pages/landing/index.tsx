import { ContainerFluid, Div, Image } from "components/base";
import LandingPageHeader from "./landing.header";
import LandingBrandSection from "./landing.brand";
import LandingGame from "./landing.games";
import LandingSponsor from "./landing.sponsor";
import LandingFooter from "./landing.footer";
const LandingPage = () => {

  return (
    <ContainerFluid
      flexDirection={"column"}
      minHeight={"100vh"}
    >
      <LandingPageHeader/>
      <LandingBrandSection/>
      <LandingGame/>
      <LandingSponsor/>
      <LandingFooter/>
    </ContainerFluid>
  );
};

export default LandingPage;
