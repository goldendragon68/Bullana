import { ContainerFluid } from "components/base";
import LoginLogo from "../login/login.logo"; // Reuse the same logo component
import RegisterForm from "./register.form";

const RegisterPage = () => {
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
      <RegisterForm/>
    </ContainerFluid>
  );
};

export default RegisterPage;
