import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Div } from 'components/base';
import { OutlineBtn } from 'components/elements/element.button';

const DashboardPage: React.FC = () => {
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (state.loading) {
    return (
      <Container 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
      >
        <Div>Loading...</Div>
      </Container>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <Container 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
      >
        <Div>You are not authenticated. Please login.</Div>
      </Container>
    );
  }

  return (
    <Container 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh"
      padding="2em"
    >
      <Div fontSize="24px" fontWeight="bold" mb="1em">
        Welcome to Bullana Dashboard!
      </Div>
      
      {state.user && (
        <Div mb="2em">
          <Div>Email: {state.user.email || 'N/A'}</Div>
          <Div>Username: {state.user.username || 'N/A'}</Div>
          <Div>User ID: {state.user._id || 'N/A'}</Div>
        </Div>
      )}
      
      <OutlineBtn onClick={handleLogout}>
        Logout
      </OutlineBtn>
    </Container>
  );
};

export default DashboardPage;
