import { Container, Div, Image } from "components/base";
import { OutlineBtn } from "components/elements/element.button";
import { BullanaTitle, HeaderTitle, LeftBorderDiv, WelcomeTitle } from "components/elements/element.box";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import walletService from "../../services/walletService";
import dashboardService, { DashboardStats, WalletInfo } from "../../services/dashboardService";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [backendWalletInfo, setBackendWalletInfo] = useState<WalletInfo | null>(null);
  
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    // Initialize dashboard data
    initializeDashboard();
  }, [state.isAuthenticated, navigate]);

  const initializeDashboard = async () => {
    setLoading(true);
    
    try {
      // Check wallet connection status
      if (walletService.isConnected()) {
        setIsWalletConnected(true);
        const publicKey = walletService.getPublicKey();
        if (publicKey) {
          setWalletAddress(publicKey);
        }
      }

      // Fetch dashboard data from backend
      const [stats, walletInfo] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getWalletInfo(),
      ]);

      setDashboardStats(stats);
      setBackendWalletInfo(walletInfo);

      // Update last activity
      await dashboardService.updateLastActivity();
      
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (state.user?.username) {
      return state.user.username;
    }
    return 'User';
  };

  const getWelcomeMessage = () => {
    const username = getUserDisplayName();
    return dashboardService.getWelcomeMessage(username);
  };

  const getDisplayWalletAddress = () => {
    // Prefer backend wallet info, fallback to connected wallet
    const address = backendWalletInfo?.address || walletAddress;
    return address ? dashboardService.formatWalletAddress(address) : 'Not connected';
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
        flexDirection={"column"}
        width={"100%"}
        maxWidth={"600px"}
      >
        {/* Header */}
        <Div alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
          <Div>
            <Image src={require(`assets/image/vector.png`)} height={"2em"} />
            <BullanaTitle color={"color_1"} ml={"10px"}>BULLANA</BullanaTitle>
          </Div>
          <OutlineBtn
            onClick={handleLogout}
            disabled={loading}
            fontSize={"12px"}
            px={"1em"}
            py={"0.5em"}
          >
            {loading ? "..." : "LOGOUT"}
          </OutlineBtn>
        </Div>

        {/* Welcome Section */}
        <WelcomeTitle mt={"2em"} textAlign={"center"}>
          {getWelcomeMessage()}
        </WelcomeTitle>
        
        <HeaderTitle 
          mt={"1em"} 
          fontSize={"16px"} 
          color={"color_3"} 
          textAlign={"center"}
        >
          {loading ? "Loading your dashboard..." : "Your account is ready to use"}
        </HeaderTitle>

        {/* Quick Stats */}
        {dashboardStats && (
          <Div mt={"2em"} flexDirection={"column"}>
            <HeaderTitle fontSize={"14px"} color={"color_1"} mb={"1em"}>
              Quick Stats
            </HeaderTitle>
            <Div justifyContent={"space-between"} alignItems={"center"}>
              <Div flexDirection={"column"} textAlign={"center"}>
                <HeaderTitle fontSize={"18px"} color={"color_1"}>
                  {dashboardStats.totalGames}
                </HeaderTitle>
                <HeaderTitle fontSize={"10px"} color={"color_3"}>
                  Games Played
                </HeaderTitle>
              </Div>
              <Div flexDirection={"column"} textAlign={"center"}>
                <HeaderTitle fontSize={"18px"} color={"green"}>
                  {dashboardStats.winRate.toFixed(1)}%
                </HeaderTitle>
                <HeaderTitle fontSize={"10px"} color={"color_3"}>
                  Win Rate
                </HeaderTitle>
              </Div>
              <Div flexDirection={"column"} textAlign={"center"}>
                <HeaderTitle fontSize={"18px"} color={"color_1"}>
                  {dashboardService.formatCurrency(dashboardStats.totalEarnings)}
                </HeaderTitle>
                <HeaderTitle fontSize={"10px"} color={"color_3"}>
                  Total Earnings
                </HeaderTitle>
              </Div>
            </Div>
          </Div>
        )}

        {/* User Info Cards */}
        <Div mt={"3em"} flexDirection={"column"}>
          {/* Account Info Card */}
          <Div 
            p={"1.5em"} 
            bg={"bg_3"} 
            borderRadius={"10px"}
            border={"1px solid"}
            borderColor={"bg_5"}
            mb={"1.5em"}
          >
            <HeaderTitle fontSize={"14px"} color={"color_1"} mb={"1em"}>
              Account Information
            </HeaderTitle>
            
            <Div flexDirection={"column"}>
              <Div justifyContent={"space-between"} alignItems={"center"} mb={"0.8em"}>
                <HeaderTitle fontSize={"12px"} color={"color_3"}>
                  Username:
                </HeaderTitle>
                <HeaderTitle fontSize={"12px"} color={"color_1"}>
                  {state.user?.username || 'Not set'}
                </HeaderTitle>
              </Div>
              
              <Div justifyContent={"space-between"} alignItems={"center"} mb={"0.8em"}>
                <HeaderTitle fontSize={"12px"} color={"color_3"}>
                  Email:
                </HeaderTitle>
                <HeaderTitle fontSize={"12px"} color={"color_1"}>
                  {state.user?.email || 'Not set'}
                </HeaderTitle>
              </Div>
              
              <Div justifyContent={"space-between"} alignItems={"center"}>
                <HeaderTitle fontSize={"12px"} color={"color_3"}>
                  Status:
                </HeaderTitle>
                <HeaderTitle fontSize={"12px"} color={"green"}>
                  Active
                </HeaderTitle>
              </Div>
            </Div>
          </Div>

          {/* Wallet Info Card */}
          <Div 
            p={"1.5em"} 
            bg={"bg_3"} 
            borderRadius={"10px"}
            border={"1px solid"}
            borderColor={"bg_5"}
          >
            <HeaderTitle fontSize={"14px"} color={"color_1"} mb={"1em"}>
              Wallet Information
            </HeaderTitle>
            
            <Div flexDirection={"column"}>
              <Div justifyContent={"space-between"} alignItems={"center"} mb={"0.8em"}>
                <HeaderTitle fontSize={"12px"} color={"color_3"}>
                  Wallet Type:
                </HeaderTitle>
                <HeaderTitle fontSize={"12px"} color={"color_1"}>
                  Phantom
                </HeaderTitle>
              </Div>
              
              <Div justifyContent={"space-between"} alignItems={"center"} mb={"0.8em"}>
                <HeaderTitle fontSize={"12px"} color={"color_3"}>
                  Status:
                </HeaderTitle>
                <HeaderTitle 
                  fontSize={"12px"} 
                  color={isWalletConnected ? "green" : "orange"}
                >
                  {isWalletConnected ? "Connected" : "Disconnected"}
                </HeaderTitle>
              </Div>
              
              <Div flexDirection={"column"}>
                <HeaderTitle fontSize={"12px"} color={"color_3"} mb={"0.5em"}>
                  Wallet Address:
                </HeaderTitle>
                <HeaderTitle 
                  fontSize={"10px"} 
                  color={"color_1"}
                  bg={"bg_2"}
                  p={"0.5em"}
                  borderRadius={"5px"}
                  style={{ wordBreak: 'break-all' }}
                >
                  {getDisplayWalletAddress()}
                </HeaderTitle>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* Action Buttons */}
        <Div mt={"3em"} flexDirection={"column"}>
          <OutlineBtn
            width={"100%"}
            onClick={() => navigate('/games')}
            bg={"bg_5"}
            mb={"1em"}
          >
            START PLAYING
          </OutlineBtn>
          
          <OutlineBtn
            width={"100%"}
            onClick={() => navigate('/profile')}
          >
            MANAGE PROFILE
          </OutlineBtn>
        </Div>

        {/* Footer Info */}
        <Div 
          mt={"2em"} 
          p={"1em"} 
          textAlign={"center"}
          fontSize={"10px"}
          color={"color_3"}
        >
          Welcome to Bullana Bet! Your account is ready to use.
        </Div>
      </Container>
    </LeftBorderDiv>
  );
};

export default Dashboard;
