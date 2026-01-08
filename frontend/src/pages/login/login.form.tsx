import { Container, Div, Image } from "components/base";
import { OutlineBtn } from "components/elements/element.button";
import { Checkbox, FormInput } from "components/elements/element.form";
import { BottomLink, BottomTag, BullanaTitle, HeaderTitle, LeftBorderDiv, WelcomeTitle } from "components/elements/element.box";
import { IconGoogle, IconWallet } from "components/icons";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import walletService from "../../services/walletService";

const LoginForm = () => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordStep, setIsPasswordStep] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle email/phone next step
  const handleNextStep = () => {
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number");
      return;
    }
    
    if (!checked) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    
    setError("");
    setIsPasswordStep(true);
  };

  // Handle login submission
  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await login(emailOrPhone, password);
      
      if (result.success) {
        if (result.requiresTFA) {
          // Handle 2FA flow if needed
          navigate('/verify-2fa', { state: { tempToken: result.tempToken } });
        } else {
          // Successful login, redirect to dashboard
          navigate('/dashboard');
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  // Handle back to email step
  const handleBackToEmail = () => {
    setIsPasswordStep(false);
    setPassword("");
    setError("");
  };

  // Handle Google login (placeholder)
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login not implemented yet");
    setError("Google login is not available yet");
  };

  // Handle WalletConnect
  const handleWalletConnect = async () => {
    if (!walletService.isPhantomInstalled()) {
      setError("Phantom wallet is not installed. Redirecting to installation page...");
      setTimeout(() => {
        walletService.redirectToPhantom();
      }, 2000);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const result = await walletService.connect();
      
      if (result.success && result.publicKey) {
        // For wallet authentication, we could either:
        // 1. Register the wallet as a new user if it doesn't exist
        // 2. Login with wallet address if user exists
        // For now, let's try to login with the wallet address
        
        setError("Wallet-based authentication is coming soon! For now, please use email/password login.");
        // TODO: Implement wallet-based authentication backend endpoint
        
        // Example of what wallet login could look like:
        // const loginResult = await login(result.publicKey, 'WALLET_AUTH');
        // if (loginResult.success) {
        //   navigate('/dashboard');
        // }
      } else {
        setError(result.message || "Failed to connect wallet");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeftBorderDiv
      flexDirection={"column"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"start"}
      backgroundColor={"bg_2"}
    >
      <Container
        pt={["1.5em", "2.5em", "3.5em", "4.5em"]}
        px={["1.5em", "3em", "4.5em", "6em"]}
        flexDirection={"column"}>
        <Div>
          <Image src={require(`assets/image/vector.png`)} height={"2em"} />
          <BullanaTitle color={"color_1"} ml={"10px"}>BULLANA</BullanaTitle>
        </Div>
        <WelcomeTitle mt={"10px"}>
          {isPasswordStep ? "Enter your password" : "Welcome to Bullana"}
        </WelcomeTitle>
        
        {/* Error message */}
        {error && (
          <Div mt={"1em"} color={"red"} fontSize={"14px"}>
            {error}
          </Div>
        )}
        
        {!isPasswordStep ? (
          // Email/Phone Step
          <>
            <HeaderTitle mt={"1em"}>Email/Phone number</HeaderTitle>
            <FormInput
              mt={"0.5em"}
              placeholder="Email/Phone (without country code)"
              value={emailOrPhone}
              onChange={(event) => setEmailOrPhone(event.target.value)}
            />
            <Div mt={"2em"} justifyItems={"center"}>
              <Checkbox
                checked={checked}
                onChange={(event) => {
                  setChecked(event.target.checked);
                }} />
              <HeaderTitle ml={"10px"}>By creating an account, I agree to Bullana Terms of Service and Privacy Policy.</HeaderTitle>
            </Div>
            <OutlineBtn
              my={"2em"}
              width={"100%"}
              onClick={handleNextStep}
              disabled={loading}
            >
              NEXT
            </OutlineBtn>
          </>
        ) : (
          // Password Step
          <>
            <HeaderTitle mt={"1em"}>Password</HeaderTitle>
            <FormInput
              mt={"0.5em"}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
            <Div mt={"1em"} justifyContent={"space-between"} width={"100%"}>
              <OutlineBtn
                onClick={handleBackToEmail}
                disabled={loading}
                bg={"bg_5"}
              >
                BACK
              </OutlineBtn>
              <OutlineBtn
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </OutlineBtn>
            </Div>
          </>
        )}
        
        <Div alignItems={"center"} justifyContent={"center"} mt={"2em"}>
          <Div width={"100%"} height={"1px"} bg={"white"} />
          <HeaderTitle bg={"bg_2"} px={"0.5em"} position={"absolute"}>or</HeaderTitle>
        </Div>
        
        <OutlineBtn
          mt={"2em"}
          width={"100%"}
          justifyContent={"start"}
          bg={"bg_5"}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <IconGoogle size="1em" />
          <Div width={"100%"} justifyContent={"center"}>CONTINUE WITH GOOGLE</Div>
        </OutlineBtn>
        
        <OutlineBtn
          mt={"2em"}
          width={"100%"}
          justifyContent={"start"}
          bg={"bg_5"}
          onClick={handleWalletConnect}
          disabled={loading}
        >
          <IconWallet size="1em" />
          <Div width={"100%"} justifyContent={"center"}>CONTINUE WITH WALLETCONNECT</Div>
        </OutlineBtn>
      </Container>
      <BottomTag position={"fixed"} bottom={"2.5em"}>
          <BottomLink href={"/register"}>Sign up as an entity&nbsp;</BottomLink>
          or
          <BottomLink href={"/login"}> &nbsp;Login</BottomLink>
      </BottomTag>
    </LeftBorderDiv >
  );
};

export default LoginForm;
