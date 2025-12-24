export interface IconProps {
  size?: string;
  color?: string;
  style?: React.CSSProperties;
}

export interface ArrowIconProps extends IconProps {
  dir?: "up" | "down" | "left" | "right";
}
