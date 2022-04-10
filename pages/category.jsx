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
        {/* <Typography variant="body1">
          These are all the categories in the menu if you expand it. Categories
          will be used so that if want to learn about a specific topic in an
          ecoregion you can click on the category and all the related posts will
          be displayed. When authors create a post they will pick 1 main
          category but they can also add additional tags for which the article
          can be searched by. None of these are set in stone, they are just the
          initial ones I came up with. I know it's alot, tried to find the
          balance between broad and specific. I would love y'alls input if you
          have any ideas
        </Typography> */}
        <Description
          description="These are all the categories in the menu if you expand it. Categories
          will be used so that if want to learn about a specific topic in an
          ecoregion you can click on the category and all the related posts will
          be displayed. When authors create a post they will pick 1 main
          category but they can also add additional tags for which the article
          can be searched by. None of these are set in stone, they are just the
          initial ones I came up with. I know it's alot, tried to find the
          balance between broad and specific. I would love y'alls input if you
          have any ideas"
          align="left"
        />
        <Typography> </Typography>
        <Typography className={classes.spacer} variant="h5">
          animals/ plants/ fungi/ arthropods
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          species subcategories
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          These will be like the mammal page where it shows general info,
          photos, and links to other resources, they will not be user
          submissions I don't think.
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          guides
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          These will be posts that either do a general deep dive on a specific
          species or compare/discuss several species. These and the rest of the
          categories will be user submitted
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          hunt
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          tracking/stalking
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related tracking/stalking
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          trapping
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to trapping
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          fishing
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to fishing
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          strategies/ techniques
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Things like how to specifically hunt whitetail or turkeys
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          processing
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Field dressing, skinning, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          tools
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Things like bow making, maybe also how to use specific tools
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          gather
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          edible
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to wild edibles
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          medicinal
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to herbal medicine
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          survival
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          fire
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to fires
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          water
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to water
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          basic shelter
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to basic shelters
        </Typography>
        <Typography variant="h5">navigation</Typography>
        <Typography variant="body1">Anything related to navigation</Typography>
        <Typography variant="h5">emergency</Typography>
        <Typography variant="body1">
          Emergency situation skills like injuries and rescue etc.
        </Typography>
        <Typography variant="h5">travel</Typography>
        <Typography variant="h5">land</Typography>
        <Typography variant="body1">
          Could range from mountaineering type skills to a review about your
          favorite hiking spot to what type of gear you should use for the
          appalachian trail
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          water
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Similar but water related so paddling, rafting skills etc. River trip
          reviews etc.{" "}
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          agriculture
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          planting/ harvesting
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to planting/harvesting
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          maintenance/ management
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Weeding techniques, pruning, anything that happens between plant and
          harvest
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          processing/ storage
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Canning, smoking, root cellars, etc.{" "}
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          propogation/ cultivation
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Seed propogation, collection, and storage, all tree nursery stuff,
          etc.{" "}
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          livestock
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything livestock related
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          soil health
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Composting techniques, soil building and maintenance, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          irrigation
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          how to get water to your stuff. Not sure if it needs it's own category
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          techniques/ systems
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Permaculture type stuff, or specific farming
          practices/systems/techniques that you employ
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          start-to-finish/ lifecycles
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          I was thinking if you want to do a deep dive on one specific crop or
          species all the way through it's entire lifecycle. Not sure if this
          should be it's own also.
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          building
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          foundations/ floors
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to foundations/floors
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          walls
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to building walls
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          roofs
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to roofing
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          complete structures
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          This could either be like start to finish on a building or like
          fencing, outhouse, decks, pavilions, etc.
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          water systems
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Water systems for the house or like pond building or routing water
          through the environment somehow etc.
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          heating/cooling
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything related to heating/cooling
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          furniture/ utensils/ tools
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          How to make or use these things
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          NOT SURE IF SANITION SYSTEMS NEED A CATEGORY OR WHERE THAT MIGHT GO
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          culture
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Idea for culture section was anything that isn't utility based I guess
          but could be interesting
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          cooking/recipes
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Recipes but also like how to pit roast a pig or something
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          clothing
        </Typography>{" "}
        variant='h5'
        <Typography className={classes.spacer} variant="body1">
          How to make clothing, thought tanning hides would also go here but not
          positive that is the right place for it
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          art
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Anything art related. Not sure if there is a better word that
          basically covers all art that isn't music (sculpting, painting, etc.)
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          music
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Songs maybe but also how to make instruments
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          rituals
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Kind of like a religion section but basically any ritualistic type
          stuff people might do
        </Typography>
        <Typography className={classes.spacer} variant="h5">
          stories
        </Typography>
        <Typography className={classes.spacer} variant="body1">
          Stories maybe? Saw Foxfire books had this thought it was kind of
          interesting
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default category;
