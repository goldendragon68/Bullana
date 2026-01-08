import { ContainerFluid, Div, LinkBase } from "components/base";
import styled from "styled-components";

interface AvatarContainerProps {
    size?: string;
    bgColor?: string;
    src?: string;
    borderSize?: string;
}
export const AvatarContainer = styled.div<AvatarContainerProps>`
  width: ${(props) => props.size || '44px'};
  height: ${(props) => props.size || '44px'};
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || '#ccc'};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => `calc(${props.size || '50px'} / 2.5)`};
  border: ${(props) => props.borderSize ? `${props.borderSize} solid #A3844C` : '2px solid #A3844C'};
  position: relative;
`;

interface ChainIconContainerProps {
    size?: string;
    bgColor?: string;
    src?: string;
    borderSize?: string;
}
export const ChainIconContainer = styled.div<ChainIconContainerProps>`
  width: ${(props) => props.size || '17px'};
  height: ${(props) => props.size || '17px'};
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || 'black'};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border: ${(props) => props.borderSize ? `${props.borderSize} solid #A3844C` : '1px solid #A3844C'};
  position: absolute;
  bottom: -5px;
  right: 0px;
`;
