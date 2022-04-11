import Nav from "../components/Nav";
import { Container, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "../components/Header";
import Description from "../components/Description";
import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
  spacer: {
    marginBottom: 10,
  },
}));

const category = () => {
  const classes = useStyles();

  return (
    <>
      {/* <Nav /> */}
      <Container>
        <Header title="Category Breakdown" />
        <Description
          description="This is a general breakdown of the categories that may be selected when creating a post. Each category has a brief description of the types of possible posts that should be included in that category"
          align="left"
        />
        <Typography> </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Guides:
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          A guides category can be found under each of the main species
          categories Animals, Plants, Fungi and Arthropods. This category is for
          posts that may be more in depth and complete than the general info
          given for that species(id guides, lifecycles, etc.) or for posts that
          share information on several species within the main category e.g. a
          comparison of species of hickory trees within an ecoregion
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Hunt:
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Tracking/Stalking
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to tracking or stalking
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Trapping
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to trapping
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Fishing
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to fishing
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Strategies/Techniques
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about strategies or techniques for hunting specific species or
          terrain e.g. how to hunt whitetail deer in specific situations
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Processing
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about field dressing, skinning, processing, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Tools
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about processes like bow or arrow making, or how to use specific
          tools for hunting
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Gather:
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Edible
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to wild edibles
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Medicinal
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to herbal medicine
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Survival:
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Fire
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to fires and fire making
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Water
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to water collection, purification, etc. in a survival
          setting
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Basic shelter
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to basic shelters
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Navigation
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to navigation in a survival setting
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Emergency
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to emergency situation skills like injuries and
          rescue etc.
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Travel:
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          land
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts ould range from mountaineering type skills to a review about
          your favorite hiking spot to what type of gear you should use for the
          appalachian trail etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Water
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Similar to land but water related so paddling, rafting skills, river
          trip reviews etc.
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Agriculture:
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Planting/Harvesting
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to planting or harvesting
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Maintenance/Management
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about weeding techniques, pruning, or any other management that
          happens between planting and harvesting
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Processing/Storage
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about canning, smoking, root cellars, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Propogation/Cultivation
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posta about seed propogation, collection, and storage. Any tree
          nursery stuff, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Livestock
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything livestock related
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Soil health
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about composting techniques, soil building and maintenance, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Irrigation
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about how to get water to your stuff.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Techniques/Systems
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about specific farming practices/systems/techniques that you
          employ e.g. permaculture etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Start-to-finish/Lifecycles
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Deep dives on one specific crop or species all the way through it's
          entire lifecycle.
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          Building:
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Foundations/ floors
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to foundations
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Floors
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to floors
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Walls
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to building walls
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Roofs
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to roofing
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Complete structures
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          This could either be a post about the start to finish process on a
          building or a post about fencing, outhouses, decks, pavilions, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Water systems
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about water systems for a house or perhaps pond building or
          routing water through the environment for whatever situation etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Heating/Cooling
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to heating and cooling
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Furniture/Tools
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Posts about how to make or use furniture, utensils or any type of tool
        </Typography>

        <Typography className={classes.spacer} variant="h5" color="secondary">
          Culture:
        </Typography>

        <Typography className={classes.spacer} variant="h6">
          Cooking/Recipes
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Recipes but also posts about cooking processes and techniques like how
          to pit roast a pig etc.
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Clothing
        </Typography>

        <Typography className={classes.spacer} variant="body1">
          Posts about how to make clothing, from tanning to sewing, as well as
          styling
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Art
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything art related. Not sure if there is a better word that
          basically covers all art that isn't music (sculpting, painting, etc.)
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Music
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Songs perhaps but also posts about how to make and use instruments
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Rituals
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to rituals whether it be religious or otherwise
        </Typography>
        <Typography className={classes.spacer} variant="h6">
          Stories
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Storytelling
        </Typography>
        <Typography className={classes.spacer} variant="h5" color="secondary">
          NOT SURE IF SANITION SYSTEMS NEED A CATEGORY OR WHERE THAT MIGHT GO
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default category;
