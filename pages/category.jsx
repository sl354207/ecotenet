import Nav from "../components/Nav";
import { Container, Typography } from "@material-ui/core";
// TEMPORARY
const category = () => {
  const menuItems = [
    {
      menuTitle: "Animals",
      menuSubs: [
        "Mammals",
        "Reptiles",
        "Amphibians",
        "Birds",
        "Fish/Mollusk",
        "Guides",
      ],
      pageURL: "/",
    },
    {
      menuTitle: "Plants",
      menuSubs: ["Trees", "Shrubs", "Vines", "Wildflowers", "Ferns", "Guides"],
      pageURL: "/schedule",
    },
    {
      menuTitle: "Fungi",
      menuSubs: ["Gilled", "Non-Gilled", "Gastromycetes", "Guides"],
      pageURL: "/history",
    },
    {
      menuTitle: "Arthropods",
      menuSubs: [
        "Crustaceans",
        "Myriapods",
        "Chelicerates",
        "Insects",
        "Guides",
      ],
      pageURL: "/gallery",
    },
    {
      menuTitle: "Hunt",
      menuSubs: [
        "Tracking/Stalking",
        "Trapping",
        "Fishing",
        "Strategies/Techniques",
        "Processing",
        "Tools",
      ],
      pageURL: "/pageant",
    },
    {
      menuTitle: "Gather",
      menuSubs: ["Edible", "Medicinal"],
      pageURL: "/volunteer",
    },
    {
      menuTitle: "Travel",
      menuSubs: ["Land", "Water"],
      pageURL: "/sponsors",
    },
    {
      menuTitle: "Survival",
      menuSubs: ["Fire", "Water", "Basic Shelter", "Navigation", "Emergency"],
      pageURL: "/contact",
    },
    {
      menuTitle: "Agriculture",
      menuSubs: [
        "Planting/Harvesting",
        "Maintenance/Management",
        "Processing/Storage",
        "Livestock",
        "Soil Health",
        "Propogation/Cultivation",
        "Irrigation",
        "Techniques/Systems",
        "Start-To-Finish/Lifecycles",
      ],
      pageURL: "/pageant",
    },
    {
      menuTitle: "Building",
      menuSubs: [
        "Foundations/Floors",
        "Walls",
        "Roofs",
        "Complete Structures",
        "Water Systems",
        "Heating/Cooling",
        "Furniture/Utensils/Tools",
      ],
      pageURL: "/volunteer",
    },
    {
      menuTitle: "Culture",
      menuSubs: [
        "Cooking/Recipes",
        "Clothing",
        "Art",
        "Music",
        "Rituals",
        "Stories",
      ],
      pageURL: "/sponsors",
    },
  ];

  return (
    <>
      <Nav />
      <Container>
        <Typography variant="body1">
          Categories will be used so that if want to learn about a specific
          topic in an ecoregion you can click on the category and all the
          related posts will be displayed. When authors create a post they will
          pick 1 main category but they can also add additional tags for which
          the article can be searched by. None of these are set in stone, they
          are just the initial ones I came up with. I know it's alot, tried to
          find the balance between broad and specific. I would love y'alls input
          if you have any ideas
        </Typography>
        <Typography> </Typography>
        <Typography variant="h3">animals/plants/fungi/arthropods</Typography>
        <Typography variant="h4">species subcategories</Typography>
        <Typography variant="body1">
          These will be like the mammal page where it shows general info,
          photos, and links to other resources, they will not be user
          submissions I don't think.
        </Typography>
        <Typography variant="h4">guides</Typography>
        <Typography variant="body1">
          These will be posts that either do a general deep dive on a specific
          species or compare/discuss several species. These and the rest of the
          categories will be user submitted
        </Typography>
        <Typography variant="h3">hunt</Typography>
        <Typography variant="h4">tracking/stalking</Typography>
        <Typography variant="body1">
          Anything related tracking/stalking
        </Typography>
        <Typography variant="h4">trapping</Typography>
        <Typography variant="body1">Anything related to trapping</Typography>
        <Typography variant="h4">fishing</Typography>
        <Typography variant="body1">Anything related to fishing</Typography>
        <Typography variant="h4">strategies/techniques</Typography>
        <Typography variant="body1">
          Things like how to specifically hunt whitetail or turkeys
        </Typography>
        <Typography variant="h4">processing</Typography>
        <Typography variant="body1">Field dressing, skinning, etc.</Typography>
        <Typography variant="h4">tools</Typography>
        <Typography variant="body1">
          Things like bow making, maybe also how to use specific tools
        </Typography>
        <Typography variant="h3">gather</Typography>
        <Typography variant="h4">edible</Typography>
        <Typography variant="body1">
          Anything related to wild edibles
        </Typography>
        <Typography variant="h4">medicinal</Typography>
        <Typography variant="body1">
          Anything related to herbal medicine
        </Typography>
        <Typography variant="h3">survival</Typography>
        <Typography variant="h4">fire</Typography>
        <Typography variant="body1">Anything related to fires</Typography>
        <Typography variant="h4">water</Typography>
        <Typography variant="body1">Anything related to water</Typography>
        <Typography variant="h4">basic shelter</Typography>
        <Typography variant="body1">
          Anything related to basic shelters
        </Typography>
        <Typography variant="h4">navigation</Typography>
        <Typography variant="body1">Anything related to navigation</Typography>
        <Typography variant="h4">emergency</Typography>
        <Typography variant="body1">
          Emergency situation skills like injuries and rescue etc.
        </Typography>
        <Typography variant="h3">travel</Typography>
        <Typography variant="h4">land</Typography>
        <Typography variant="body1">
          Could range from mountaineering type skills to a review about your
          favorite hiking spot to what type of gear you should use for the
          appalachian trail
        </Typography>
        <Typography variant="h4">water</Typography>
        <Typography variant="body1">
          Similar but water related so paddling, rafting skills etc. River trip
          reviews etc.{" "}
        </Typography>
        <Typography variant="h3">agriculture</Typography>
        <Typography variant="h4">planting/harvesting</Typography>
        <Typography variant="body1">
          Anything related to planting/harvesting
        </Typography>
        <Typography variant="h4">maintenance/management</Typography>
        <Typography variant="body1">
          Weeding techniques, pruning, anything that happens between plant and
          harvest
        </Typography>
        <Typography variant="h4">processing/storage</Typography>
        <Typography variant="body1">
          Canning, smoking, root cellars, etc.{" "}
        </Typography>
        <Typography variant="h4">propogation/cultivation</Typography>
        <Typography variant="body1">
          Seed propogation, collection, and storage, all tree nursery stuff,
          etc.{" "}
        </Typography>
        <Typography variant="h4">livestock</Typography>
        <Typography variant="body1">Anything livestock related</Typography>
        <Typography variant="h4">soil health</Typography>
        <Typography variant="body1">
          Composting techniques, soil building and maintenance, etc.
        </Typography>
        <Typography variant="h4">irrigation</Typography>
        <Typography variant="body1">
          how to get water to your stuff. Not sure if it needs it's own category
        </Typography>
        <Typography variant="h4">techniques/systems</Typography>
        <Typography variant="body1">
          Permaculture type stuff, or specific farming
          practices/systems/techniques that you employ
        </Typography>
        <Typography variant="h4">start-to-finish/lifecycles</Typography>
        <Typography variant="body1">
          I was thinking if you want to do a deep dive on one specific crop or
          species all the way through it's entire lifecycle. Not sure if this
          should be it's own also.
        </Typography>
        <Typography variant="h3">building</Typography>
        <Typography variant="h4">foundations/floors</Typography>
        <Typography variant="body1">
          Anything related to foundations/floors
        </Typography>
        <Typography variant="h4">walls</Typography>
        <Typography variant="body1">
          Anything related to building walls
        </Typography>
        <Typography variant="h4">roofs</Typography>
        <Typography variant="body1">Anything related to roofing</Typography>
        <Typography variant="h4">complete structures</Typography>
        <Typography variant="body1">
          This could either be like start to finish on a building or like
          fencing, outhouse, decks, pavilions, etc.
        </Typography>
        <Typography variant="h4">water systems</Typography>
        <Typography variant="body1">
          Water systems for the house or like pond building or routing water
          through the environment somehow etc.
        </Typography>
        <Typography variant="h4">heating/cooling</Typography>
        <Typography variant="body1">
          Anything related to heating/cooling
        </Typography>
        <Typography variant="h4">furniture/utensils/tools</Typography>
        <Typography variant="body1">How to make or use these things</Typography>
        <Typography variant="body1">
          NOT SURE IF SANITION SYSTEMS NEED A CATEGORY OR WHERE THAT MIGHT GO
        </Typography>
        <Typography variant="h3">culture</Typography>
        <Typography variant="body1">
          Idea for culture section was anything that isn't utility based I guess
          but could be interesting
        </Typography>
        <Typography variant="h4">cooking/recipes</Typography>
        <Typography variant="body1">
          Recipes but also like how to pit roast a pig or something
        </Typography>
        <Typography variant="h4">clothing</Typography> variant='h4'
        <Typography variant="body1">
          How to make clothing, thought tanning hides would also go here but not
          positive that is the right place for it
        </Typography>
        <Typography variant="h4">art</Typography>
        <Typography variant="body1">
          Anything art related. Not sure if there is a better word that
          basically covers all art that isn't music (sculpting, painting, etc.)
        </Typography>
        <Typography variant="h4">music</Typography>
        <Typography variant="body1">
          Songs maybe but also how to make instruments
        </Typography>
        <Typography variant="h4">rituals</Typography>
        <Typography variant="body1">
          Kind of like a religion section but basically any ritualistic type
          stuff people might do
        </Typography>
        <Typography variant="h4">stories</Typography>
        <Typography variant="body1">
          Stories maybe? Saw Foxfire books had this thought it was kind of
          interesting
        </Typography>
      </Container>
    </>
  );
};

export default category;
