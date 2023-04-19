import Description from "@components/layouts/Description";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

const category = () => {
  return (
    <>
      <NextSeo
        title="Categories"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Get a breakdown of each post category that is available to filter by within an ecoregion"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/category",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo.svg",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />
      <Container>
        <Header title="Category Breakdown" />
        <Description
          description="This is a general breakdown of the categories that may be selected when creating a post. Each category has a brief description of the types of possible posts that should be included in that category"
          align="left"
        />
        <Typography> </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Guides:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          A guides category can be found under each of the main species
          categories Animals, Plants, Fungi and The Rest. This category is for
          posts that may be more in depth and complete than the general info
          given for that species(id guides, lifecycles, etc.) or for posts that
          share information on several species within the main category e.g. a
          comparison of species of hickory trees within an ecoregion
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Hunt:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Tracking/Stalking
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to tracking or stalking
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Trapping
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to trapping
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Fishing
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to fishing
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Strategies/Techniques
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about strategies or techniques for hunting specific species or
          terrain e.g. how to hunt whitetail deer in specific situations
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Processing
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about field dressing, skinning, processing, etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Tools
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about processes like bow or arrow making, or how to use specific
          tools for hunting
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Gather:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Edible
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to wild edibles
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Medicinal
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to herbal medicine
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Survival:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Fire
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to fires and fire making
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Water
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to water collection, purification, etc. in a survival
          setting
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Basic shelter
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to basic shelters
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Navigation
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to navigation in a survival setting
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Emergency
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to emergency situation skills like injuries and
          rescue etc.
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Travel:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          land
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts could range from mountaineering type skills to a review about
          your favorite hiking spot to what type of gear you should use for the
          appalachian trail etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Water
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Similar to land but water related so paddling, rafting skills, river
          trip reviews etc.
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Agriculture:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Planting/Harvesting
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to planting or harvesting
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Maintenance/Management
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about weeding techniques, pruning, or any other management that
          happens between planting and harvesting
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Processing/Storage
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about canning, smoking, root cellars, etc.
        </Typography>

        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Livestock
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything livestock related
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Soil health
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about composting techniques, soil building and maintenance, etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Propogation/Cultivation
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about seed propogation, collection, and storage. Any tree
          nursery stuff, etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Irrigation
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about how to get water to your stuff.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Techniques/Systems
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about specific farming practices/systems/techniques that you
          employ e.g. permaculture etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Start-to-finish/Lifecycles
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Deep dives on one specific crop or species all the way through
          it&apos;s entire lifecycle.
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Building:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Foundations
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to foundations
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Floors
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to floors
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Walls
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to building walls
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Roofs
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to roofing
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Complete structures
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          This could either be a post about the start to finish process on a
          building or a post about fencing, outhouses, decks, pavilions, etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Water systems
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about water systems for a house or perhaps pond building or
          routing water through the environment for whatever situation etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Heating/Cooling
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to heating and cooling
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Sanitation
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to sanitation
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Furniture/Tools
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about how to make or use furniture, utensils or any type of tool
        </Typography>
        <Typography
          sx={{ marginBottom: "10px" }}
          variant="h5"
          color="secondary"
        >
          Culture:
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Cooking/Recipes
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Recipes but also posts about cooking processes and techniques like how
          to pit roast a pig etc.
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Clothing
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Posts about how to make clothing, from tanning to sewing, as well as
          styling
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Art
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything art related. Not sure if there is a better word that
          basically covers all art (music, sculpting, painting, etc.)
        </Typography>

        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Rituals
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Anything related to rituals whether it be religious or otherwise
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="h6">
          Stories
        </Typography>
        <Typography sx={{ marginBottom: "10px" }} variant="body1">
          Storytelling
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default category;
