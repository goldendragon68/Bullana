import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  ResponsiveValue,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  system,
  typography,
  TypographyProps,
} from "styled-system";
import { Property } from "csstype";

export interface AllProps
  extends BackgroundProps,
    BorderProps,
    ColorProps,
    FlexboxProps,
    GridProps,
    LayoutProps,
    PositionProps,
    ShadowProps,
    SpaceProps,
    TypographyProps {
  backdropFilter?: ResponsiveValue<Property.BackdropFilter>;
  transition?: ResponsiveValue<Property.Transition>;
  transform?: ResponsiveValue<Property.Transform>;
  cursor?: ResponsiveValue<Property.Cursor>;
  whiteSpace?: ResponsiveValue<Property.WhiteSpace>;
  visibility?: ResponsiveValue<Property.Visibility>;
  backgroundClip?: ResponsiveValue<Property.BackgroundClip>;
  textOverflow?: ResponsiveValue<Property.TextOverflow>;
  filter?: ResponsiveValue<Property.Filter>;
  columnGap?: ResponsiveValue<Property.ColumnGap>;
  rowGap?: ResponsiveValue<Property.RowGap>;
  boxSizing?: ResponsiveValue<Property.BoxSizing>;
  mixBlendMode?: ResponsiveValue<Property.MixBlendMode>;
  transformStyle?: ResponsiveValue<Property.TransformStyle>;
  textTransform?: ResponsiveValue<Property.TextTransform>;
  aspectRatio?: ResponsiveValue<Property.AspectRatio>;
  clipPath?: ResponsiveValue<Property.ClipPath>;
  outline?: ResponsiveValue<Property.Outline>;
  objectFit?: ResponsiveValue<Property.ObjectFit>;
  objectPosition?: ResponsiveValue<Property.ObjectPosition>;
  ref?: any;
  uppercase?: boolean;
}

const transform = system({ transform: true });
const boxSizing = system({ boxSizing: true });
const mixBlendMode = system({ mixBlendMode: true });
const transformStyle = system({ transformStyle: true });
const aspectRatio = system({ aspectRatio: true });
const clipPath = system({ clipPath: true });
const rowGap = system({ rowGap: true });
const columnGap = system({ columnGap: true });
const backdropFilter = system({ backdropFilter: true });
const transition = system({ transition: true });
const filter = system({ filter: true });
const visibility = system({ visibility: true });
const textOverflow = system({ textOverflow: true });
const whiteSpace = system({ whiteSpace: true });
const backgroundClip = system({ backgroundClip: true });
const cursor = system({ cursor: true });
const textTransform = system({ textTransform: true });
const outline = system({ outline: true });
const objectFit = system({ objectFit: true });
const objectPosition = system({ objectPosition: true });

// allCompose
export const allCompose = compose(
  background,
  border,
  color,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography,
  transform,
  boxSizing,
  mixBlendMode,
  transformStyle,
  aspectRatio,
  clipPath,
  columnGap,
  rowGap,
  backdropFilter,
  transition,
  filter,
  visibility,
  textOverflow,
  whiteSpace,
  backgroundClip,
  cursor,
  textTransform,
  outline,
  objectFit,
  objectPosition
);

export interface DivProps extends AllProps {}

export interface InputProps extends AllProps {
  outline?: string;
}

export interface LinkBaseProps extends AllProps {
  hoverBg?: string;
  hoverColor?: string;
  hoverUL?: string;
  hoverOpacity?: string;
  disabled?: boolean;
}

export interface FlexProps {
  row?: boolean;
  col?: boolean;
  flexFull?: boolean;
  center?: boolean;
  justifyCenter?: boolean;
  alignCenter?: boolean;
  spaceBetween?: boolean;
  spaceAround?: boolean;
}
