import { Container, Div, Image } from "components/base";
import { OutlineBtn } from "components/elements/element.button";
import { FormInput } from "components/elements/element.form";
import { BottomLink, BottomTag, BullanaTitle, HeaderTitle, LeftBorderDiv, WelcomeTitle } from "components/elements/element.box";
import { IconWallet } from "components/icons";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import walletService from "../../services/walletService";
import axios from "axios";

// Types for better type safety
interface UserExistsResponse {
  exists: boolean;
  verified: boolean;
}

interface RegistrationData {
  username: string;
  email: string;
  password: string;
  refer: string;
  walletAddress: string;
  walletType: string;
}

// Error types for better error handling
enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  WALLET = 'wallet',
  REGISTRATION = 'registration'
}

interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
}

const RegisterForm = () => {
  // Form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [success, setSuccess] = useState<string>("");
  
  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:13578';

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Error handling helper
  const handleError = useCallback((error: any, type: ErrorType, defaultMessage: string): void => {
    console.error(`${type.toUpperCase()} Error:`, error);
    
    let message = defaultMessage;
    
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }
    
    setError({ type, message });
  }, []);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError({ type: ErrorType.VALIDATION, message: "Please enter your name" });
      return false;
    }
    
    if (!email.trim()) {
      setError({ type: ErrorType.VALIDATION, message: "Please enter your email" });
      return false;
    }
    
    if (!validateEmail(email)) {
      setError({ type: ErrorType.VALIDATION, message: "Please enter a valid email address" });
      return false;
    }

    if (!password.trim()) {
      setError({ type: ErrorType.VALIDATION, message: "Please enter a password" });
      return false;
    }

    if (!validatePassword(password)) {
      setError({ type: ErrorType.VALIDATION, message: "Password must be at least 6 characters long" });
      return false;
    }

    if (password !== confirmPassword) {
      setError({ type: ErrorType.VALIDATION, message: "Passwords do not match" });
      return false;
    }

    if (!isWalletConnected || !walletAddress) {
      setError({ type: ErrorType.WALLET, message: "Please connect your Phantom wallet to continue" });
      return false;
    }

    return true;
  };

  // Test backend connectivity
  const testBackendConnectivity = async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/basic/testFunction`, {
        timeout: 5000
      });
      console.log('✅ Backend connectivity test passed:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Backend connectivity test failed:', error);
      handleError(error, ErrorType.NETWORK, "Cannot connect to server. Please check if the backend is running.");
      return false;
    }
  };

  // Check if user already exists
  const checkUserExists = async (email: string, username: string): Promise<UserExistsResponse | null> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/basic/check-user-exists`, {
        email: email.trim(),
        username: username.trim()
      }, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('User existence check failed, proceeding with registration:', error);
      return null;
    }
  };

  // Handle registration process
  const handleRegister = async (): Promise<void> => {
    // Clear previous messages
    clearError();
    setSuccess("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Test backend connectivity
      console.log('🔍 Testing backend connectivity...');
      const isBackendReachable = await testBackendConnectivity();
      if (!isBackendReachable) {
        return;
      }
      
      // Step 2: Check if user already exists
      console.log('👤 Checking if user already exists...');
      const existsCheck = await checkUserExists(email, name);
      
      if (existsCheck?.exists) {
        if (existsCheck.verified) {
          setError({ 
            type: ErrorType.REGISTRATION, 
            message: "This username or email is already registered. Please try logging in instead." 
          });
          return;
        } else {
          setError({ 
            type: ErrorType.REGISTRATION, 
            message: "This username or email is already registered but not verified. Redirecting to verification page..." 
          });
          
          // Navigate to verification page after showing message
          setTimeout(() => {
            navigate('/confirm-registration', { 
              state: { 
                email: email.trim(),
                username: name.trim() 
              },
              replace: true
            });
          }, 2000);
          return;
        }
      }
      
      // Step 3: Proceed with registration
      console.log('🚀 Proceeding with user registration...');
      const userData: RegistrationData = {
        username: name.trim(),
        email: email.trim(),
        password: password,
        refer: '',
        walletAddress: walletAddress,
        walletType: 'phantom'
      };
      
      const result = await register(userData);
      console.log('📦 Registration result:', result);
      
      // Handle registration response
      const isSuccess = result.success === true || 
                       result.success === 1 || 
                       result.data?.success === 1 || 
                       result.data?.success === true;
      
      if (isSuccess) {
        console.log('✅ Registration successful!');
        setSuccess("Registration successful! Please check your email for verification code. Redirecting...");
        
        // Navigate to confirmation page
        setTimeout(() => {
          navigate('/confirm-registration', { 
            state: { 
              email: email.trim(),
              username: name.trim(),
              registrationComplete: true
            },
            replace: true
          });
        }, 1500);
      } else {
        const errorMessage = result.message || 
                           result.data?.msg || 
                           result.data?.message || 
                           "Registration failed. Please try again.";
        
        setError({ 
          type: ErrorType.REGISTRATION, 
          message: errorMessage 
        });
      }
    } catch (err: any) {
      handleError(err, ErrorType.REGISTRATION, "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // Wallet event handlers
  const handleWalletConnect = useCallback(async (): Promise<void> => {
    if (!walletService.isPhantomInstalled()) {
      setError({ 
        type: ErrorType.WALLET, 
        message: "Phantom wallet is not installed. Redirecting to installation page..." 
      });
      setTimeout(() => {
        walletService.redirectToPhantom();
      }, 2000);
      return;
    }

    if (isWalletConnected) {
      // Disconnect wallet
      setLoading(true);
      try {
        const result = await walletService.disconnect();
        if (result.success) {
          setSuccess("Wallet disconnected successfully");
          setIsWalletConnected(false);
          setWalletAddress("");
        } else {
          setError({ 
            type: ErrorType.WALLET, 
            message: result.message || "Failed to disconnect wallet" 
          });
        }
      } catch (err: any) {
        handleError(err, ErrorType.WALLET, "Failed to disconnect wallet");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Connect wallet
    setLoading(true);
    clearError();
    
    try {
      const result = await walletService.connect();
      
      if (result.success && result.publicKey) {
        setSuccess("Wallet connected successfully!");
        setIsWalletConnected(true);
        setWalletAddress(result.publicKey);
        
        // Auto-fill fields if empty
        if (!email.trim()) {
          setEmail(`wallet_${result.publicKey.slice(0, 8)}@bullana.local`);
        }
        
        if (!name.trim()) {
          setName(`User_${result.publicKey.slice(0, 8)}`);
        }
      } else {
        setError({ 
          type: ErrorType.WALLET, 
          message: result.message || "Failed to connect wallet" 
        });
      }
    } catch (err: any) {
      handleError(err, ErrorType.WALLET, "An error occurred while connecting to wallet");
    } finally {
      setLoading(false);
    }
  }, [isWalletConnected, email, name, handleError, clearError]);

  // Setup wallet event listeners
  useEffect(() => {
    // Check if wallet is already connected
    if (walletService.isConnected()) {
      setIsWalletConnected(true);
      const publicKey = walletService.getPublicKey();
      if (publicKey) {
        setWalletAddress(publicKey);
      }
    }

    // Setup event listeners
    const handleConnect = (publicKey: string) => {
      setIsWalletConnected(true);
      setWalletAddress(publicKey);
      clearError();
    };

    const handleDisconnect = () => {
      setIsWalletConnected(false);
      setWalletAddress("");
    };

    const handleAccountChanged = (publicKey: string | null) => {
      if (publicKey) {
        setWalletAddress(publicKey);
      } else {
        setIsWalletConnected(false);
        setWalletAddress("");
      }
    };

    walletService.on('connect', handleConnect);
    walletService.on('disconnect', handleDisconnect);
    walletService.on('accountChanged', handleAccountChanged);

    return () => {
      walletService.off('connect', handleConnect);
      walletService.off('disconnect', handleDisconnect);
      walletService.off('accountChanged', handleAccountChanged);
    };
  }, [clearError]);

  // Keyboard handler for Enter key
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading && isWalletConnected) {
      handleRegister();
    }
  };

  // Input change handlers that respect loading state
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) setConfirmPassword(event.target.value);
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
        pb={["5em", "6em", "7em", "8em"]}
        flexDirection={"column"}
      >
        <Div>
          <Image src={require(`assets/image/vector.png`)} height={"2em"} />
          <BullanaTitle color={"color_1"} ml={"10px"}>BULLANA</BullanaTitle>
        </Div>
        <WelcomeTitle mt={"10px"}>
          Sign up to Bullana
        </WelcomeTitle>
        
        {/* Error message with better styling */}
        {error && (
          <Div 
            mt={"1em"} 
            p={"1em"} 
            bg={"rgba(255, 0, 0, 0.1)"} 
            borderRadius={"5px"}
            border={"1px solid red"}
          >
            <Div color={"red"} fontSize={"14px"}>
              <strong>{error.type.toUpperCase()}:</strong> {error.message}
            </Div>
          </Div>
        )}
        
        {/* Success message with better styling */}
        {success && (
          <Div 
            mt={"1em"} 
            p={"1em"} 
            bg={"rgba(0, 255, 0, 0.1)"} 
            borderRadius={"5px"}
            border={"1px solid green"}
          >
            <Div color={"green"} fontSize={"14px"}>
              <strong>SUCCESS:</strong> {success}
            </Div>
          </Div>
        )}
        
        {/* Name Field */}
        <HeaderTitle mt={"1em"}>Name</HeaderTitle>
        <FormInput
          mt={"0.5em"}
          placeholder="Enter your full name"
          value={name}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
        />
        
        {/* Email Field */}
        <HeaderTitle mt={"1em"}>Email</HeaderTitle>
        <FormInput
          mt={"0.5em"}
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleKeyPress}
        />
        
        {/* Password Field */}
        <HeaderTitle mt={"1em"}>Password</HeaderTitle>
        <FormInput
          mt={"0.5em"}
          type="password"
          placeholder="Enter your password (min 6 characters)"
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
        />
        
        {/* Confirm Password Field */}
        <HeaderTitle mt={"1em"}>Confirm Password</HeaderTitle>
        <FormInput
          mt={"0.5em"}
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onKeyPress={handleKeyPress}
        />
        
        {/* Wallet Connection Section */}
        <Div alignItems={"center"} justifyContent={"center"} mt={"1.5em"}>
          <Div width={"100%"} height={"1px"} bg={"white"} />
          <HeaderTitle bg={"bg_2"} px={"0.5em"} position={"absolute"}>
            Connect Wallet
          </HeaderTitle>
        </Div>
        
        {/* Connect Wallet Button */}
        <OutlineBtn
          mt={"1.5em"}
          width={"100%"}
          justifyContent={"start"}
          bg={isWalletConnected ? "bg_3" : "bg_5"}
          onClick={handleWalletConnect}
          disabled={loading}
        >
          <IconWallet size="1em" />
          <Div width={"100%"} justifyContent={"center"}>
            {isWalletConnected ? "DISCONNECT WALLET" : "CONNECT WALLET"}
          </Div>
        </OutlineBtn>
        
        {/* Wallet Status Display */}
        {isWalletConnected && walletAddress && (
          <Div mt={"1em"} p={"1em"} bg={"bg_3"} borderRadius={"5px"}>
            <HeaderTitle fontSize={"12px"} color={"color_1"}>
              ✅ Wallet Connected:
            </HeaderTitle>
            <Div fontSize={"10px"} color={"color_3"} mt={"0.5em"}>
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </Div>
          </Div>
        )}
        
        {/* Register Button */}
        <OutlineBtn
          my={"2em"}
          width={"100%"}
          onClick={handleRegister}
          disabled={loading || !isWalletConnected}
          onKeyPress={handleKeyPress}
        >
          {loading ? "REGISTERING..." : "REGISTER"}
        </OutlineBtn>

        {/* Login Link */}
        <BottomTag mt={"1em"} width={"100%"} textAlign={"center"}>
          <BottomLink href={"/login"}>
            Already have an account? Login
          </BottomLink>
        </BottomTag>
      </Container>
    </LeftBorderDiv>
  );
};

export default RegisterForm;