import styled from "styled-components";
import {
  allCompose,
  AllProps,
  DivProps,
  InputProps,
  LinkBaseProps,
  FlexProps
} from "./interface.base";
import { Link } from "react-router-dom";

// Containers
export const Div = styled.div<DivProps>`
  ${allCompose}
`;
Div.defaultProps = {
  boxSizing: "border-box",
  display: "flex",
};

export const ContainerFluid = styled(Div)``;
ContainerFluid.defaultProps = {
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
};
export const Container = styled(Div)``;
Container.defaultProps = {
  width: "100%",
  maxWidth: "1660px",
  px: ["1.5em", "2.5em", "3.5em", "4.5em"],
};

// Input
export const Input = styled.input<InputProps>`
  ${allCompose}
  &::-webkit-inner-spin-button {
    display: none;
  }
  &::-webkit-inner-spin-button {
    color: currentColor;
    filter: invert(1);
  }
  &::-webkit-calendar-picker-indicator {
    color: currentColor;
    filter: invert(1);
  }
`;
Input.defaultProps = {
  outline: "none",
  border: "none",
  boxSizing: "border-box",
  fontSize: "1em",
  lineHeight: "1.2em",
};
export const TextArea = styled.textarea<InputProps>`
  ${allCompose}
  &::-webkit-inner-spin-button {
    display: none;
  }
`;
TextArea.defaultProps = {
  outline: "none",
  boxSizing: "border-box",
};

// Label
export const Label = styled.label<AllProps>`
  ${allCompose}
`;
Label.defaultProps = {
  boxSizing: "border-box",
};

// Image
export const Image = styled.img<AllProps>`
  ${allCompose}
`;
Image.defaultProps = {
  boxSizing: "border-box",
};

// Video
export const Video = styled.video<AllProps>`
  ${allCompose}
`;
Video.defaultProps = {
  autoPlay: true,
  loop: true,
  muted: true,
  playsInline: true,
  controls: false,
};

// LinkBase
export const LinkBase = styled.a<LinkBaseProps>`
  ${allCompose}
  text-decoration: none;
  pointer-events: ${(p) => (p.disabled ? "none" : "unset")};
  opacity: ${(p) => (p.disabled ? "0.3" : "1")};
  &:hover {
    background: ${(p) => p.hoverBg};
    color: ${(p) => p.hoverColor};
    text-decoration: ${(p) => p.hoverUL};
    opacity: ${(p) => p.hoverOpacity};
  }
`;
LinkBase.defaultProps = {
  color: "currentColor",
  display: "inline-flex",
  boxSizing: "border-box",
  cursor: "pointer",
};


export const Flex = styled(Div)<FlexProps>`
  flex-direction: ${(p: any) => (p.row ? "row" : p.col ? "column" : "")};
  flex-grow: ${(p: any) => (p.flexFull ? "1" : "")};
  justify-content: ${(p: any) =>
    p.center
      ? "center"
      : p.justifyCenter
      ? "center"
      : p.spaceBetween
      ? "space-between"
      : p.spaceAround
      ? "space-around"
      : ""};
  align-items: ${(p: any) =>
    p.center ? "center" : p.alignCenter ? "center" : ""};
`;
Flex.defaultProps = {
  display: "flex",
};

// Button
export const Button = styled.button<AllProps>`
  ${allCompose}
`;
Button.defaultProps = {
  boxSizing: "border-box",
  border: "none",
  background: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

