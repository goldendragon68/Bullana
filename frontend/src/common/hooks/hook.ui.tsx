import { useEffect, useMemo, useRef, useState } from "react";

export const useCollapse = (_collapsed?: boolean) => {
  const [collapsed, setCollapsed] = useState(_collapsed);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const element = useRef<HTMLElement>();
  const resizeHandle = () => {
    setContentHeight(element.current?.scrollHeight || 0);
  };
  useEffect(() => {
    window.addEventListener("resize", resizeHandle);
    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, []);
  useEffect(() => {
    resizeHandle();
  });
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const collapse = () => {
    setCollapsed(true);
  };
  const expand = () => {
    setCollapsed(false);
  };
  return {
    element,
    collapsed,
    setCollapsed,
    toggle,
    collapse,
    expand,
    contentHeight: collapsed ? "0px" : `${contentHeight}px`,
  };
};

export const useScroll = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const checkVisible = () => {
    if (!ref.current) return false;
    const { top } = ref.current.getBoundingClientRect();
    if (top > (window.innerHeight * 2) / 3) return false;
    else return true;
  };
  useEffect(() => {
    setVisible(checkVisible());
    const scrollHandler = (_: Event) => {
      setVisible(checkVisible());
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
  return { visible, element: ref };
};

export const useDropDown = () => {
  const mainBtn = useRef<HTMLElement>();
  const panel = useRef<HTMLElement>();

  const [collapse, setCollapse] = useState(true);

  const [leftPos, setLeftPos] = useState(0);
  const [topPos, setTopPos] = useState(0);
  const [bottomPos, setBottomPos] = useState(0);
  const [rightPos, setRightPos] = useState(0);

  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [isLeftBasis, setIsLeftBasis] = useState(true);
  const [isBottomBasis, setIsBottomBasis] = useState(true);

  const updatePannelPosition = () => {
    if (!mainBtn.current) return;
    const { top, bottom, right, left, width, height } =
      mainBtn.current.getBoundingClientRect();
    setTopPos(top);
    setBottomPos(bottom);
    setRightPos(right);
    setLeftPos(left);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    setScreenWidth(screenWidth);
    setScreenHeight(screenHeight);
    setIsLeftBasis(left < screenWidth - left - width);
    setIsBottomBasis(top < screenHeight - top - height);
  };
  const handleClickEvent = (event: any) => {
    if (
      panel?.current &&
      !panel.current.contains(event.target) &&
      mainBtn?.current &&
      !mainBtn.current.contains(event.target)
    ) {
      setCollapse(true);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", updatePannelPosition);
    window.addEventListener("click", handleClickEvent);
    return () => {
      window.removeEventListener("resize", updatePannelPosition);
      window.removeEventListener("click", handleClickEvent);
    };
  }, []);
  useEffect(() => {
    if (!collapse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [collapse]);

  useEffect(updatePannelPosition);

  const top = useMemo(() => {
    return isBottomBasis ? bottomPos : topPos;
  }, [bottomPos, isBottomBasis, topPos]);

  const left = useMemo(() => {
    return isLeftBasis ? leftPos : rightPos;
  }, [isLeftBasis, leftPos, rightPos]);

  const maxWidth = useMemo(() => {
    return (isLeftBasis ? screenWidth - leftPos : rightPos) - 10;
  }, [isLeftBasis, leftPos, rightPos, screenWidth]);

  const maxHeight = useMemo(() => {
    return (isBottomBasis ? screenHeight - bottomPos : topPos) - 10;
  }, [bottomPos, isBottomBasis, screenHeight, topPos]);

  return {
    leftPos,
    topPos,
    bottomPos,
    rightPos,
    collapse,
    isLeftBasis,
    isBottomBasis,
    setCollapse,
    mainBtn,
    panel,
    top,
    left,
    maxWidth,
    maxHeight,
  };
};
