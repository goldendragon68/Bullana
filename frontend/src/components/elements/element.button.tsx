import { Div, LinkBase, Button } from "components/base";
import { AllProps } from "components/base/interface.base";
import { MouseEventHandler } from "react";
import styled, { keyframes } from "styled-components";
import BtnBg from "../../assets/image/btnbg.svg";
import BtnOverBg from "../../assets/image/overbtnbg.svg";

interface IBtnBase extends AllProps {
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface ILinkBtnBase extends AllProps {
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}
const BtnBase = styled(Button) <IBtnBase>`
  transition: 300ms;
  opacity: ${(p) => (p.disabled ? "0.5" : "1")};
  pointer-events: ${(p) => (p.disabled ? "none" : "unset")};
  &:hover {
    box-shadow: 0 0 0.5em 0 currentColor inset;
  }
`;
BtnBase.defaultProps = {
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: "#C8A96D #7A5D29 #7A5D29 #C8A96D;",
  px: "1.4em",
  py: "0.7em",
  whiteSpace: "nowrap",
  lineHeight: "1em",
  fontWeight: "500",
  columnGap: "0.5em",
  justifyContent: "center",
  alignItems: "center",
};

export const NormalBtn = styled(BtnBase)``;
NormalBtn.defaultProps = {
  borderWidth: ["1px", "2px"],
  bg: "color_1",
  color: "color_black",
};

export const OutlineBtn = styled(BtnBase)``;
OutlineBtn.defaultProps = {
  bg: "bg_4",
  color: "color_1",
};
export const WarnBtn = styled(BtnBase)``;
WarnBtn.defaultProps = {
  borderWidth: ["1px", "2px"],
  bg: "color_danger",
  borderColor: "color_danger",
  color: "bg_1",
};

export const NormalBtnSm = styled(BtnBase)``;
NormalBtnSm.defaultProps = {
  bg: "color_1",
  color: "color_black",
  borderWidth: "1px",
  px: "1.2em",
  py: "0.6em",
  fontSize: "0.9em",
  fontWeight: "normal",
};

export const OutlineBtnSm = styled(BtnBase)``;
OutlineBtnSm.defaultProps = {
  bg: "bg_1",
  borderColor: "currentColor",
  color: "color_1",
  borderWidth: "1px",
  px: "1.2em",
  py: "0.6em",
  fontSize: "0.9em",
  fontWeight: "normal",
};


const longClickAnimation = keyframes`
  0% { background-color: #007bff; }
  50% { background-color: #0056b3; }
  100% { background-color: #007bff; }
`;

const HeaderBtnBase = styled(LinkBase)<ILinkBtnBase>`
  transition: 300ms;
  opacity: ${(p) => (p.disabled ? "0.5" : "1")};
  pointer-events: ${(p) => (p.disabled ? "none" : "unset")};
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:active {
    transform: scale(0.95); /* Click animation: briefly scale down */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active:focus {
    animation: ${longClickAnimation} 1s infinite; /* Long click animation: background color change */
  }
`;
HeaderBtnBase.defaultProps = {
  backgroundImage: `url(${BtnBg})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  height: "57px",
  width: "175px",
  p: "2.5px",
  whiteSpace: "nowrap",
  lineHeight: "1em",
  fontWeight: "500",
  columnGap: "0.5em",
  justifyContent: "center",
  alignItems: "center",

};

const HeaderBtnOverDiv = styled(Div)``;

HeaderBtnOverDiv.defaultProps = {
  backgroundImage: `url(${BtnOverBg})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  color: "color_1"
};

interface HeaderBtnProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children?: React.ReactNode;
}


export const HeaderBtn: React.FC<HeaderBtnProps> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <HeaderBtnBase onClick={onClick}>
      <HeaderBtnOverDiv>
        {children}
      </HeaderBtnOverDiv>
    </HeaderBtnBase>
  );
};




const LandingBtnOverDiv = styled(Div)`
 border: 1px solid; /* Set the border width, style, and color */
  border-image-source: linear-gradient(0deg, #7B5E2A 5.52%, #C7A86C 100.03%);
  border-image-slice: 1; /* This tells the browser how to slice the border image */
  border-image-width: 1px; 
`;

LandingBtnOverDiv.defaultProps = {
  width: "148px",
  height: "56px"
};

const LandingBtnOverDiv1 = styled(Div)`
border: 2px solid; 
  border-image-source: linear-gradient(0deg, #7B5E2A 0%, #C7A86C 100%);
  border-image-slice: 1; 
  border-image-width: 2px; 
  background: #1E2328;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:active {
    transform: scale(0.95); /* Click animation: briefly scale down */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active:focus {
    animation: ${longClickAnimation} 1s infinite; /* Long click animation: background color change */
  }
`;

LandingBtnOverDiv1.defaultProps = {
  width: "156px",
  height: "52px",
  position: "absolute",
  cursor: "pointer",
};

interface LandingBtnProps extends React.HTMLProps<HTMLDivElement> {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}



export const LandingBuyBtn: React.FC<LandingBtnProps> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <Div
      onClick={onClick}
      width={"160px"}
      height={"58px"}
      justifyContent={"center"}
      alignItems={"center"}
      {...props}>
      <LandingBtnOverDiv />
      <LandingBtnOverDiv1 color={"color_1"} justifyContent={"center"} alignItems={"center"}>{children}</LandingBtnOverDiv1>
    </Div>
  );
};

const PlayOutlineBtn = styled(LinkBase)``;
PlayOutlineBtn.defaultProps = {
  border: "0.5px solid #C6A76A",
  width: "100%",
  padding: "2px"
};

const PlayBtnDiv = styled(Div)``;
PlayBtnDiv.defaultProps = {
  background: "linear-gradient(180deg, #C8A96C 0%, #795C28 100%)",
  width: "100%",
  padding: "2.5px"
};

const PlayBtnTxtDiv = styled(Div)`
 &:hover {
    background: linear-gradient(360deg, #695831 0%, #5E512C 100%);
    color: white;
  }`;
PlayBtnTxtDiv.defaultProps = {
  background: "linear-gradient(360deg, #3C3628 0%, #23211B 100%)",
  width: "100%",
  padding: "1em",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "2px",
  color: "color_1",
  fontFamily: "Arial",
  textAlign: "center"
};


interface LandingPlayBtnProps extends React.HTMLProps<HTMLDivElement> {
  onClick?: (arg: any) => any;
  children?: React.ReactNode;
}

export const PlayNowBtn: React.FC<LandingPlayBtnProps> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <PlayOutlineBtn onClick={onClick}>
      <PlayBtnDiv justifyContent={"center"}>
        <PlayBtnTxtDiv justifyContent={"center"}>
          {children}
        </PlayBtnTxtDiv>
      </PlayBtnDiv>
    </PlayOutlineBtn>
  );
};