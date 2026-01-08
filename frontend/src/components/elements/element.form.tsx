import { Input, Label, LinkBase } from "components/base";
import { AllProps } from "components/base/interface.base";
import { useState, useEffect, useId } from "react";
import { FaAngleDown, FaAngleUp, FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";

const InputContainer = styled(Label)``;
InputContainer.defaultProps = {
    bg: "bg_3",
    border: "1px Solid",
    borderColor: "color_2",
    px: "0.85em",
    py: "0.85em",
    lineHeight: "1.2em",
    display: "flex",
    alignItems: "center",
    rowGap: "0.5em",
    columnGap: "0.5em",
    cursor: "text",
};


interface FormInputProps extends AllProps {
    iconBefore?: React.ReactNode;
    iconAfter?: React.ReactNode;
    placeholder?: string;
    name?: string;
    type?: React.HTMLInputTypeAttribute;
    defaultValue?: string | number | readonly string[];
    value?: string | number | readonly string[];
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
    readOnly?: boolean;
}
export const FormInput: React.FC<FormInputProps> = ({
    iconBefore,
    iconAfter,
    placeholder,
    type,
    name,
    value,
    defaultValue,
    onChange,
    onKeyPress,
    readOnly,
    ...props
}) => {
    const id = useId();
    const [visiblePassword, setVisiblePassword] = useState(false);
    return (
        <InputContainer htmlFor={id} {...props}>
            {iconBefore}
            <Input
                id={id}
                type={visiblePassword ? "text" : type}
                name={name}
                value={!type || type !== "number" ? value || "" : value || 0}
                onChange={onChange || (() => { })}
                onKeyPress={onKeyPress}
                {...(defaultValue ? { defaultValue } : {})}
                placeholder={placeholder}
                readOnly={readOnly}
                bg={"transparent"}
                width={"100%"}
                p={"0px"}
                border={"none"}
                color={"color_2"}
            />
            {type === "password" && (
                <LinkBase
                    opacity={"0.3"}
                    onClick={() => setVisiblePassword(!visiblePassword)}
                >
                    {visiblePassword ? <FaEyeSlash /> : <FaEye />}
                </LinkBase>
            )}
            {iconAfter}
        </InputContainer>
    );
};

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;
// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 28px;
  height: 28px;
  background: ${(props) => (props.checked ? "salmon" : "papayawhip")}
  border-radius: 3px;
  border: 2px solid #FFDD8F;
  transition: all 150ms;

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")}
  }
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
`

interface IProps {
    className?: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    labelWrap?: boolean;
}

export const Checkbox: React.FC<IProps> = ({
    className,
    checked,
    labelWrap = true,
    ...props
}) => {
    const content = (
        <CheckboxContainer className={className}>
            <HiddenCheckbox checked={checked} {...props} />
            <StyledCheckbox checked={checked}>
                <Icon viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                </Icon>
            </StyledCheckbox>
        </CheckboxContainer>
    );

    return labelWrap ? <CheckLabel>{content}</CheckLabel> : <>{content}</>;
};