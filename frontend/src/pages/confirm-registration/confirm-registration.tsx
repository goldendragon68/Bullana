import React, { useState, useRef, useEffect } from "react";
import { Div } from "components/base";
import { BullanaTitle, HeaderTitle } from "components/elements/element.box";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import axios from 'axios';

// Constants
const CODE_LENGTH = 4;
const RESEND_COOLDOWN = 60; // seconds
const CODE_EXPIRY = 600; // 10 minutes in seconds
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:13578';

// Icon Components
const IconMail: React.FC<{ size?: string; className?: string }> = ({ size = "24", className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
    />
  </svg>
);

const IconShield: React.FC<{ size?: string; className?: string }> = ({ size = "24", className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
    />
  </svg>
);

// API Services
const verifyRegistrationCode = async (email: string, verificationCode: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/basic/verify-registration`, {
      email,
      verificationCode
    });
    
    const { success, token, user } = response.data;

    if (success && token && user) {
      authService.setToken(token);
      authService.setUser(user);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Email verification failed');
  }
};

const resendCode = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/basic/resend-verification`, {
      email
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend verification code');
  }
};

// Utility Functions
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ConfirmRegistration = () => {
  // State Management
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(RESEND_COOLDOWN);
  const [codeExpiry, setCodeExpiry] = useState<number>(CODE_EXPIRY);
  
  // Refs and Routing
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Derived state
  const email = location.state?.email || "";
  const isCodeComplete = code.every(digit => digit !== "");

  // Effects
  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      navigate('/register', { replace: true });
      return;
    }

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [email, navigate]);

  useEffect(() => {
    // Countdown timers
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      setCodeExpiry(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Update resend availability
    if (countdown === 0 && !canResend) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [countdown, codeExpiry, canResend]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    // Handle click outside modal
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        navigate('/');
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  // Handlers
  const resetTimers = () => {
    setCountdown(RESEND_COOLDOWN);
    setCodeExpiry(CODE_EXPIRY);
    setCanResend(false);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'Enter' && isCodeComplete) {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    
    if (pastedData.length === CODE_LENGTH) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[CODE_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!isCodeComplete) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await verifyRegistrationCode(email, code.join(''));
      
      if (result.success) {
        setSuccess("Email verified successfully! Redirecting...");
        
        if (result.token && result.user) {
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        setError(result.message || "Invalid verification code");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");

    try {
      const result = await resendCode(email);
      
      if (result.success) {
        setSuccess("New verification code sent to your email!");
        resetTimers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to resend code");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code");
    } finally {
      setResendLoading(false);
    }
  };

  // Render
  return (
    <Div
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ 
        zIndex: 9999,
        backdropFilter: "blur(4px)",
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Container */}
      <Div
        ref={modalRef}
        backgroundColor="white"
        borderRadius="16px"
        width="450px"
        height="600px"
        maxWidth="90vw"
        maxHeight="90vh"
        overflow="auto"
        display="flex"
        flexDirection="column"
        style={{ 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e5e7eb",
        }}
        padding={{ xs: "2rem", md: "2.5rem" }}
      >
        {/* Header Section - Single Column Grid Layout */}
        <Div 
          display="grid" 
          gridTemplateColumns="1fr" 
          style={{ gap: "1rem" }} 
          textAlign="center" 
          marginBottom="2rem"
        >
          {/* Icon Row */}
          <Div display="flex" justifyContent="center" alignItems="center">
            <Div
              style={{ 
                color: "#3b82f6",
                filter: "drop-shadow(0 4px 6px rgba(59, 130, 246, 0.1))",
              }}
            >
              <IconShield size="48" aria-hidden="true" />
            </Div>
          </Div>
          
          {/* Brand Row */}
          <Div display="flex" justifyContent="center" alignItems="center">
            <BullanaTitle 
              color="#1f2937" 
              fontSize="1.5rem" 
              fontWeight="700"
            >
              BULLANA
            </BullanaTitle>
          </Div>
          
          {/* Title Row */}
          <Div display="flex" justifyContent="center" alignItems="center">
            <HeaderTitle 
              as="h1"
              fontSize="1.25rem" 
              fontWeight="600" 
              color="#1f2937"
            >
              Email Verification
            </HeaderTitle>
          </Div>
          
          {/* Instruction Row */}
          <Div display="flex" justifyContent="center" alignItems="center">
            <Div 
              color="#6b7280" 
              fontSize="0.875rem"
              style={{ lineHeight: "1.5" }}
            >
              Enter the 4-digit code sent to your email address
            </Div>
          </Div>
          
          {/* Email Row */}
          <Div display="flex" justifyContent="center" alignItems="center">
            <Div 
              color="#2563eb" 
              fontWeight="600" 
              fontSize="0.875rem" 
              padding="0.75rem 1rem"
              backgroundColor="#f0f9ff"
              borderRadius="0.5rem"
              style={{ 
                border: "1px solid #bae6fd",
                fontFamily: "monospace",
                wordBreak: "break-all",
                maxWidth: "100%"
              }}
            >
              {email}
            </Div>
          </Div>
        </Div>

        {/* Code Input Section */}
        <Div marginBottom="2.5rem">
          {/* Input row with expiry timer beside it */}
          <Div 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            marginBottom="1rem"
            style={{ gap: "1rem" }}
          >
            {/* Code Input Fields */}
            <Div 
              display="flex" 
              onPaste={handlePaste}
              aria-label="Verification code input"
              style={{ gap: "0.75rem" }}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  aria-label={`Digit ${index + 1} of verification code`}
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    backgroundColor: loading ? '#f9fafb' : 'white',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                />
              ))}
            </Div>

            {/* Code Expiry Timer - positioned beside inputs */}
            {codeExpiry > 0 && (
              <Div 
                color="#9ca3af" 
                fontSize="0.75rem" 
                fontWeight="500"
                style={{ whiteSpace: "nowrap" }}
              >
                {formatTime(codeExpiry)}
              </Div>
            )}
          </Div>

          {/* Expiry Error Message - positioned vertically below inputs */}
          {codeExpiry === 0 && (
            <Div 
              textAlign="center"
              marginBottom="1rem"
            >
              <Div 
                color="#dc2626" 
                fontSize="0.875rem" 
                fontWeight="500"
              >
                Verification code has expired. Please request a new one.
              </Div>
            </Div>
          )}

          {/* Status Messages */}
          {error && (
            <Div 
              backgroundColor="#fef2f2" 
              color="#dc2626" 
              fontSize="0.875rem" 
              padding="1rem" 
              borderRadius="0.5rem" 
              border="1px solid #fecaca"
              fontWeight="500"
              textAlign="center"
              marginBottom="1rem"
              role="alert"
            >
              {error}
            </Div>
          )}

          {success && (
            <Div 
              backgroundColor="#f0f9ff" 
              color="#0369a1" 
              fontSize="0.875rem" 
              padding="1rem" 
              borderRadius="0.5rem" 
              border="1px solid #bae6fd"
              fontWeight="500"
              textAlign="center"
              marginBottom="1rem"
              role="status"
            >
              {success}
            </Div>
          )}
        </Div>

        {/* Action Buttons */}
        <Div display="flex" flexDirection={{ xs: "column", sm: "row" }} style={{ gap: "1rem" }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: "#f3f4f6",
              color: "#6b7280",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flex: 1,
            }}
            disabled={loading}
            aria-label="Cancel verification"
          >
            Cancel
          </button>

          <button
            onClick={handleResendCode}
            disabled={!canResend || resendLoading}
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: canResend ? "#f0f9ff" : "#f9fafb",
              color: canResend ? "#0369a1" : "#9ca3af",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              border: `1px solid ${canResend ? "#bae6fd" : "#e5e7eb"}`,
              cursor: canResend ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              flex: 1,
            }}
            aria-label={canResend ? "Resend verification code" : `Resend available in ${countdown} seconds`}
          >
            {resendLoading ? (
              <Div display="flex" alignItems="center" justifyContent="center" style={{ gap: "0.5rem" }}>
                <Div
                  style={{
                    width: "1rem",
                    height: "1rem",
                    border: "2px solid transparent",
                    borderTop: "2px solid currentColor",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}
                  aria-hidden="true"
                />
                Sending...
              </Div>
            ) : canResend ? "Resend Code" : `Resend (${countdown}s)`}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isCodeComplete || loading}
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: isCodeComplete ? "#3b82f6" : "#9ca3af",
              color: "white",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              border: "none",
              cursor: isCodeComplete ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              flex: 1,
            }}
            aria-label={isCodeComplete ? "Verify code" : "Please complete the code"}
          >
            {loading ? (
              <Div display="flex" alignItems="center" justifyContent="center" style={{ gap: "0.5rem" }}>
                <Div
                  style={{
                    width: "1rem",
                    height: "1rem",
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}
                  aria-hidden="true"
                />
                Verifying...
              </Div>
            ) : (
              "Verify"
            )}
          </button>
        </Div>

        {/* Help Text */}
        <Div textAlign="center" marginTop="1.5rem">
          <Div 
            color="#9ca3af" 
            fontSize="0.875rem" 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            fontWeight="500"
            style={{ gap: "0.5rem" }}
          >
            <IconMail size="16" aria-hidden="true" />
            Check your spam folder if you don't see the email
          </Div>
        </Div>
      </Div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Div>
  );
};

export default ConfirmRegistration;