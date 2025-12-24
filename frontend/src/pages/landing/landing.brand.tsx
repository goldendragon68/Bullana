import { CardCollection } from "common/types/types.collection";
import { Container, Div, Image } from "components/base";
import { CasinoCard } from "components/elements/element.card";
import { IconCasino, IconRacing, IconSports, IconTrading } from "components/icons";

const cardlist: CardCollection[] = [
  {
    title: "CASINO",
    description: "Dive into our in-house games, live casino and slots",
    bgurl: require(`assets/image/cardbg.png`),
    icon: <IconCasino />
  },
  {
    title: "SPORTS",
    description: "Bet on Football, Cricket, NFL, eSports & over 80 sports",
    bgurl: require(`assets/image/cardbg.png`),
    icon: <IconSports />
  },
  {
    title: "RACING",
    description: "Experience the thrill of horse racing and enjoy the winnings",
    bgurl: require(`assets/image/cardbg.png`),
    icon: <IconRacing />
  },
  {
    title: "TRADING",
    description: "Bet on the rise and fall of crypto prices to win profits",
    bgurl: require(`assets/image/cardbg.png`),
    icon: <IconTrading />
  }
];

const LandingBrandSection = () => {

  return (
    <Container
      pt={"10px"}
    >
      <Div
        width={"100%"}
        display={"grid"}
        gridTemplateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(2, 1fr)",
          "repeat(4, 1fr)",
        ]}
        columnGap={"2em"}
        rowGap={"2em"}
      >
        {cardlist.map((_, index) => (
          <CasinoCard
            key={index}
            title={_.title}
            bgurl={_.bgurl}
            icon={_.icon}
            description={_.description}
          />
        ))
        }
      </Div>
    </Container>
  );
};

export default LandingBrandSection;
