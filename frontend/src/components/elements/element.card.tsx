import { Div, Image } from "components/base";
import styled from "styled-components";
import CardBg from "../../assets/image/cardbackbg.png";
import GameCardTopBg from "../../assets/image/gamecardtopbg.svg";

import { HiUsers } from "react-icons/hi2";
import { IoInformationCircleOutline } from "react-icons/io5";
import { DividerLine } from "./element.shape";
import { PlayNowBtn } from "./element.button";


interface BackgroundImageDivProps {
  imageUrl: string;
}
const CardBgOverDiv = styled(Div) <BackgroundImageDivProps>`
  background-image: url(${props => props.imageUrl});
  border: 2.5px solid #644C21
`;

CardBgOverDiv.defaultProps = {
  width: "100%",
  height: "96%",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  position: "absolute"
};

const BackgroundImage = styled.img`
  width: 95%;
  height: 100%;
  object-fit: fill; /* Ensures the image covers both width and height */
  position: absolute;
`;

const CasinoCardTitle = styled(Div)``;
CasinoCardTitle.defaultProps = {
  fontSize: "24px",
  fontWeight: "800",
  lineHeight: "29px",
  letterSpacing: "0.025em",
};

const CasinoCardDesc = styled(Div)``;
CasinoCardDesc.defaultProps = {
  fontSize: "13px",
  fontWeight: "400",
  lineHeight: "15px",
  textAlign: "center"
};




interface CasinoCardProps {
  title?: string;
  description?: string;
  bgurl?: string;
  icon?: React.ReactNode;
  onClick?: (arg: any) => any;
}

export const CasinoCard: React.FC<CasinoCardProps> = ({
  title,
  description,
  bgurl,
  icon,
  onClick
}) => {
  return (
    <Div
      height={"280px"}
      justifyContent={"center"}
      position={"relative"}
      alignItems={"center"}>
      <BackgroundImage src={CardBg} alt="Background" />
      <CardBgOverDiv imageUrl={bgurl || ""}>
        <Div
          width={"100%"}
          height={"100%"}
          background={"linear-gradient(180deg, #050E15 0%, rgba(5, 14, 21, 0) 10%, rgba(5, 14, 21, 0) 56%, #050E15 100%)"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          alignItems={"center"}>
          {icon}
          <CasinoCardTitle>{title}</CasinoCardTitle>
          <CasinoCardDesc p={"1em"}>{description}</CasinoCardDesc>
        </Div>
      </CardBgOverDiv>
    </Div>
  );
};
//Game card
const GameCardTopBgDiv = styled(Div)``;

GameCardTopBgDiv.defaultProps = {
  zIndex: 1,
  backgroundImage: `url(${GameCardTopBg})`,
  width: "100%",
  height: "22px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

const GameCardDiv = styled(Div)``;

GameCardDiv.defaultProps = {
  marginTop: "-11px",
  width: "100%",
  border: "1.5px solid #634B13"
};
const GameCardTitle = styled(Div)``;
GameCardTitle.defaultProps = {
  fontSize: "12px",
  fontWeight: "500",
  lineHeight: "14px",
  letterSpacing: "0.02em",
  textAlign: "center"
};




interface GameCardProps {
  users: number;
  bgurl: string;
  onClick?: (arg: any) => any;
}

export const GameCard: React.FC<GameCardProps> = ({
  users,
  bgurl,
  onClick
}) => {
  return (
    <Div
      alignItems={"center"}
      position={"relative"}
      flexDirection={"column"}>
      <GameCardTopBgDiv
        justifyContent={"center"}
        alignItems={"center"}>
        <HiUsers color="#4DC85C" size={"14px"} />
        <GameCardTitle ml={1}>{users}</GameCardTitle>
      </GameCardTopBgDiv>
      <GameCardDiv
        alignItems={"center"}
        flexDirection={"column"}>
        <Div
          width={"100%"}
          flexDirection={"column"}
          position={"relative"}>
          <Image
            width={"100%"}
            src={bgurl} />
          <Div
            height={"20%"}
            width={"100%"}
            bottom={0}
            position={"absolute"}
            background={"linear-gradient(180deg, rgba(2, 17, 32, 0) 0%, rgba(2, 17, 32, 0.73) 52.4%, #021120 100%)"}
          />
          <Div position={"absolute"} right={"10px"} top={"10px"}>
            <IoInformationCircleOutline color="#929292" size={"20px"} />
          </Div>
        </Div>
        <Div p={"1em"}
          flexDirection={"column"}
          alignItems={"center"}
          width={"100%"}>
          <GameCardTitle color={"color_4"}>Rollgame Orginals</GameCardTitle>
          <DividerLine mt={"10px"} />
          <Div 
            width={"100%"}
            p={"1em"} pb="0.5em" pt="1.5em">
            <PlayNowBtn>PLAY NOW</PlayNowBtn>
          </Div>
        </Div>
      </GameCardDiv>

    </Div>
  );
};