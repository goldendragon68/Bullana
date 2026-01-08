import { GameCardCollection } from "common/types/types.collection";
import { Container, Div, Image, LinkBase } from "components/base";
import { GameCard } from "components/elements/element.card";
import { Tab, TabItem } from "components/elements/element.tab";

const cardlist: GameCardCollection[] = [
  {
    users: 589,
    bgurl: require(`assets/image/game1.png`),
  },
  {
    users: 589,
    bgurl: require(`assets/image/game2.png`),
  },
  {
    users: 589,
    bgurl: require(`assets/image/game3.png`),
  },
  {
    users: 589,
    bgurl: require(`assets/image/game4.png`),
  },
  {
    users: 589,
    bgurl: require(`assets/image/game5.png`),
  },
];

const LandingGame = () => {

  return (
    <Container
      flexDirection={"column"}
      mt={"5em"}
    >
      <Tab>
        <TabItem label="TOP GAMES">
          <Div
            width={"100%"}
            display={"grid"}
            mt={"1em"}
            gridTemplateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(5, 1fr)",
            ]}
            columnGap={"2em"}
            rowGap={"2em"}
          >
            {cardlist.map((_, index) => (
              <GameCard
                key={index}
                users={_.users}
                bgurl={_.bgurl}
              />
            ))
            }
          </Div>
        </TabItem>
        <TabItem label="MOST PLAYED">
          <Div
            width={"100%"}
            display={"grid"}
            mt={"1em"}
            gridTemplateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(5, 1fr)",
            ]}
            columnGap={"2em"}
            rowGap={"2em"}
          >
            {cardlist.map((_, index) => (
              <GameCard
                key={index}
                users={_.users}
                bgurl={_.bgurl}
              />
            ))
            }
          </Div>
        </TabItem>
        <TabItem label="RECENT BIG WINS">
          <Div
            width={"100%"}
            display={"grid"}
            mt={"1em"}
            gridTemplateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(5, 1fr)",
            ]}
            columnGap={"2em"}
            rowGap={"2em"}
          >
            {cardlist.map((_, index) => (
              <GameCard
                key={index}
                users={_.users}
                bgurl={_.bgurl}
              />
            ))
            }
          </Div>
        </TabItem>
      </Tab>
      <Div p={"3em"} justifyContent={"center"}>
        <LinkBase
          href="#"
          color={"color_4"}
          flexDirection={"column"}
          alignItems={"center"}>
          More games
          <Image
            src={require(`assets/image/moregame.png`)}
            mt={"5px"}
          />
        </LinkBase>
      </Div>
    </Container>
  );
};

export default LandingGame;
