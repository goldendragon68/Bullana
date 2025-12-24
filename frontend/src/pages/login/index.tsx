import { ContainerFluid, Div, Image } from "components/base";
import LoginLogo from "./login.logo";
import LoginForm from "./login.form";

const LoginPage = () => {

  return (
    <ContainerFluid
      flexDirection={"row"}
      maxHeight={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      display={"grid"}
            gridTemplateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
            ]}
    >
      <LoginLogo/>
      <LoginForm/>
    </ContainerFluid>
  );
};

export default LoginPage;
