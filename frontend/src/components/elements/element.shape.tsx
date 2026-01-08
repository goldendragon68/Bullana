import { Div } from "components/base";
import styled from "styled-components";

export const GradientLine = styled(Div)``;
GradientLine.defaultProps = {
  background: "linear-gradient(90deg, transparent, currentColor, transparent)",
  color: "second_color",
  maxHeight: "1px",
  minHeight: "1px",
  width: "100%",
};

export const GradientHeight = styled(Div)``;
GradientHeight.defaultProps = {
  background: "linear-gradient(180deg, rgba(121, 92, 40, 0) 0%, #795C28 21.9%, #C9AA6D 51.4%, #795C28 82.4%, rgba(121, 92, 40, 0) 100%)",
  color: "second_color",
  maxWidth: "1px",
  minWidth: "1px",
  height: "100%",
};


export const DividerLine = styled(Div)``;
DividerLine.defaultProps = {
  background: "#463714",
  maxHeight: "1px",
  minHeight: "1px",
  width: "100%",
};