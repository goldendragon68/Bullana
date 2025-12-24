import styled from "styled-components";
import { TfiMenuAlt } from "react-icons/tfi";
import { useCollapse } from "common/hooks/hook.ui";
import {
  Div,
  ContainerFluid,
  Container,
  Image,
  LinkBase,
  Flex,
} from "components/base";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { NavLink, Title700 } from "components/elements/element.box";
import { IconMessage } from "components/icons";
import { GradientHeight } from "components/elements/element.shape";
import { AvatarContainer, ChainIconContainer } from "components/elements/element.avatar";
import { formatNumber } from "common/utils";
import { HeaderBtn } from "components/elements/element.button";

const HeaderOutWrapper = styled(ContainerFluid)``;
HeaderOutWrapper.defaultProps = {
  position: "fixed",
  backdropFilter: "blur(6px)",
  flexDirection: "column",
  justifyContent: "center",
  height: "89px",
  zIndex: 10,
};

const HeaderInWrapper = styled(Container)``;
HeaderInWrapper.defaultProps = {
  py: "1em",
  height: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  alignContent: "center",
  display: ["grid", "grid", "grid", "flex"],
  gridTemplateColumns: "repeat(2, auto)",
  gridTemplateRows: "repeat(2, auto)",
};

const LogoWrapper = styled(LinkBase)``;
LogoWrapper.defaultProps = {
  gridArea: "1 / 1 / 2 / 2",
};

const MenuWrapper = styled(Div)``;
MenuWrapper.defaultProps = {
  flex: "1",
  gridArea: [
    "2 / 1 / 3 / 3",
    "2 / 1 / 3 / 3",
    "2 / 1 / 3 / 3",
    "1 / 2 / 2 / 3",
  ],
  flexDirection: ["column", "column", "column", "row"],
  columnGap: "1.5em",
  alignItems: "center",
  rowGap: "1em",
  overflowY: ["hidden", "hidden", "hidden", "visible"],
  transition: "300ms",
};

const MenuController = styled(LinkBase)``;
MenuController.defaultProps = {
  ml: "auto",
  gridArea: "1 / 2 / 2 / 3",
  display: ["flex", "flex", "flex", "none"],
  fontSize: "1.5em",
  color: "color_1"
};

const MenuIcon = styled(LinkBase)``;
MenuIcon.defaultProps = {
  mr: "1em",
  fontSize: "1.5em",
  color: "color_1"
};


const LayoutHeader = () => {
  const { element, collapsed, toggle, collapse, contentHeight } =
    useCollapse(true);
  const navigate = useNavigate();

  const ref = useRef<any>();

  const headerCollapseHandler = useCallback(
    (e: Event) => {
      if (!ref.current?.contains(e.target)) {
        collapse();
      }
    },
    [collapse]
  );
  useEffect(() => {
    window.addEventListener("click", headerCollapseHandler);
    return () => {
      window.removeEventListener("click", headerCollapseHandler);
    };
  }, [headerCollapseHandler]);

  const [headerHeight, setHeaderHeight] = useState(0);
  const resizeHandler = useCallback(() => {
    const { height } = ref.current.getBoundingClientRect();
    setHeaderHeight(height);
  }, []);
  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [resizeHandler]);

  return (
    <>
      <HeaderOutWrapper
        background={"linear-gradient(180deg, #04101C 0%, rgba(4, 28, 18, 0.7) 100%)"}
        ref={ref}
      >
        <HeaderInWrapper>

          <MenuWrapper
            py={collapsed ? "0" : ["1em", "1em", "1em", "0"]}
            maxHeight={[contentHeight, contentHeight, contentHeight, "unset"]}
            boxSizing={"initial"}
            ref={element}
          >
            <NavLink color={"color_1"} href={"/#"} onClick={collapse}>
              TRADE
            </NavLink>
            <NavLink color={"color_1"} href={"/#"} onClick={collapse}>
              BUY
            </NavLink>
            <NavLink color={"color_1"} href={"/#"} onClick={collapse}>
              EARN
            </NavLink>
            <NavLink color={"color_1"} href={"/#"} onClick={collapse}>
              GAME
            </NavLink>
          </MenuWrapper>
          <Div
            alignItems={"center"}
            onClick={collapse}
            height={"100%"}
          >
            <MenuIcon onClick={toggle}>
              <IoMdNotifications />
            </MenuIcon>
            <MenuIcon onClick={toggle}>
              <IconMessage size="0.8em" />
            </MenuIcon>

            <GradientHeight />
            <Div ml={"1.5em"} height={"100%"}>
              <AvatarContainer
                src={require(`assets/image/avatar.png`)}>
                <ChainIconContainer
                  src={require(`assets/icon/eth_icon.png`)}
                />
              </AvatarContainer>
            </Div>
            <Div ml={"1em"} flexDirection={"column"} height={"100%"} justifyContent={"center"}>
              <Title700 color={"color_1"} letterSpacing={"2px"}>${formatNumber(10000)}</Title700>
              <Div mt={"5px"}>
                <Image src={require(`assets/icon/bull_icon.png`)} size={"1.2em"} />
                <Title700 color={"color_3"} fontSize={"14px"} ml={"5px"}>2287.67 BULS</Title700>
              </Div>
            </Div>
            <Div ml={"2em"}>
              <HeaderBtn>DEPOSIT</HeaderBtn>
            </Div>
          </Div>
          <MenuController href={"#"} onClick={toggle}>
            <TfiMenuAlt />
          </MenuController>
        </HeaderInWrapper>
      </HeaderOutWrapper>
    </>
  );
};

export default LayoutHeader;
