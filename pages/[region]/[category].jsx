import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import PostList from "@components/layouts/PostList";
import SpeciesScroll from "@components/layouts/SpeciesScroll";
import { Container, Typography } from "@mui/material";
import {
  getPostsByCategoryAndRegion,
  getSpecies,
} from "@utils/mongodb/helpers";

const categoryList = ({ category, title, id, description, tag }) => {
  return (
    <>
      <Container>
        <Header title={`Eco-${id} ${title}`} />
        {description && (
          <Typography align="center" sx={{ marginTop: "10px" }}>
            {description}
          </Typography>
        )}

        {category.length === 0 ? (
          <>
            {tag == "species" ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ marginTop: "20px" }}
              >
                We currently do not have data on this category
              </Typography>
            ) : (
              <Typography
                variant="h6"
                align="center"
                sx={{ marginTop: "20px" }}
              >
                There currently no posts on this category. Sign in to create a
                post.
              </Typography>
            )}
          </>
        ) : (
          <>
            {category[0].scientific_name ? (
              <>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ marginTop: "20px" }}
                >
                  *Eco-{id} {title} current species count: {category.length}
                </Typography>

                <SpeciesScroll category={category} />
                <Typography variant="subtitle2" align="left">
                  *These are the species currently present in this ecoregion
                  category based on our{" "}
                  <Link href="/data" underline="hover">
                    dataset.
                  </Link>{" "}
                  A species distribution often does not align perfectly with
                  ecoregion boundaries, therefore a species may not be present
                  throughout the entire ecoregion but only in specific areas. A
                  species may also be widespread but in small numbers so rarely
                  seen.
                </Typography>
              </>
            ) : (
              <>
                <PostList posts={category} />
              </>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

// UPDATE
// retrieve data at build time
export const getServerSideProps = async (context) => {
  const id = context.params.region;
  const categoryQuery = context.params.category;
  const categoryTitle = context.query.title;

  let category;
  let description;
  let tag;

  switch (categoryQuery) {
    case "mammal":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("mammal", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "reptile":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("reptile", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "amphibian":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("amphibian", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "bird":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("bird", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "fish":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("fish", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "arthropod":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("arthropod", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "mollusk":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("mollusk", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "cnidaria":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("cnidaria", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "worm":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("worm", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "other_animals":
      try {
        tag = "species";
        description =
          "These are species that either may not fit well into other categories or occur in small numbers in our dataset so they have been grouped together";
        category = await getSpecies("other_animals", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "animal_guide":
      try {
        tag = "post";
        description =
          "This category is for posts that may be more in depth and complete than the general info given for that species(id guides, lifecycle guides, etc.) or for posts that share information on several species within the category e.g. a comparison of species of oak trees within an ecoregion";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "tree_shrub":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("tree_shrub", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "vine":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("vine", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "wildflower":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("wildflower", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "water_master":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("water_master", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "graminoid":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("graminoid", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "other_plants":
      try {
        tag = "species";
        description =
          "These are species that either may not fit well into other categories or occur in small numbers in our dataset so they have been grouped together";
        category = await getSpecies("other_plants", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "uncategorized_plants":
      try {
        tag = "species";
        description =
          "These are species that we just haven't gotten to placing in their proper category yet, but rather than leave them out we placed them all here until they get categorized";
        category = await getSpecies("uncategorized_plants", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "plant_guide":
      try {
        tag = "post";
        description =
          "This category is for posts that may be more in depth and complete than the general info given for that species(id guides, lifecycle guides, etc.) or for posts that share information on several species within the category e.g. a comparison of species of oak trees within an ecoregion";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "gill_fungi":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("gill_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "non_gilled_fungi":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("non_gilled_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "gasteroid_fungi":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("gasteroid_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "other_fungi":
      try {
        tag = "species";
        description =
          "These are species that either may not fit well into other categories or occur in small numbers in our dataset so they have been grouped together";
        category = await getSpecies("other_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "uncategorized_fungi":
      try {
        tag = "species";
        description =
          "These are species that we just haven't gotten to placing in their proper category yet, but rather than leave them out we placed them all here until they get categorized";
        category = await getSpecies("uncategorized_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "fungi_guide":
      try {
        tag = "post";
        description =
          "This category is for posts that may be more in depth and complete than the general info given for that species(id guides, lifecycle guides, etc.) or for posts that share information on several species within the category e.g. a comparison of species of oak trees within an ecoregion";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "bacteria":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("bacteria", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "virus":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("virus", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "protozoa":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("protozoa", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "chromista":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("chromista", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "archaea":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("archaea", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "algae":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("algae", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "ciliate":
      try {
        tag = "species";
        description = null;
        category = await getSpecies("ciliate", id);
      } catch (err) {
        console.error(err);
      }

    case "the_rest_guide":
      try {
        tag = "post";
        description =
          "This category is for posts that may be more in depth and complete than the general info given for that species(id guides, lifecycle guides, etc.) or for posts that share information on several species within the category e.g. a comparison of species of oak trees within an ecoregion";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "hunt_track_stalk":
      try {
        tag = "post";
        description = "Posts related to tracking or stalking";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "hunt_trap":
      try {
        tag = "post";
        description = "Posts related to trapping";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "hunt_fish":
      try {
        tag = "post";
        description = "Posts related to fishing";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "hunt_strategy_technique":
      try {
        tag = "post";
        description =
          "Posts about strategies or techniques for hunting specific species or terrain e.g. how to hunt whitetail deer in specific situations";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "hunt_process":
      try {
        tag = "post";
        description = "Posts about field dressing, skinning, processing, etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "hunt_tool":
      try {
        tag = "post";
        description =
          "Posts about making tools, like bow or arrow making, or how to use specific tools for hunting";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "gather_edible":
      try {
        tag = "post";
        description = "Posts related to wild edibles";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "gather_medicinal":
      try {
        tag = "post";
        description = "Posts related to herbal medicine";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "survival_fire":
      try {
        tag = "post";
        description = "Posts related to fires and fire making";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "survival_water":
      try {
        tag = "post";
        description =
          "Posts related to water collection, purification, etc. in a survival setting";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "survival_shelter":
      try {
        tag = "post";
        description = "Posts related to basic shelter making or living";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "survival_navigation":
      try {
        tag = "post";
        description = "Posts related to navigation in a survival setting";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "survival_emergency":
      try {
        tag = "post";
        description =
          "Posts related to emergency situation skills like injuries and rescue etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "travel_land":
      try {
        tag = "post";
        description =
          "Posts related to land travel ranging from mountaineering type skills to a review about your favorite hiking spot to what type of gear you should use for a specific excursion etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "travel_water":
      try {
        tag = "post";
        description =
          "Posts related to water travel ranging from paddling type skills to a review about your favorite river float to what type of gear you should use for a specific excursion etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_plant_harvest":
      try {
        tag = "post";
        description = "Posts related to planting or harvesting";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_maintenance_management":
      try {
        tag = "post";
        description =
          "Posts about weeding techniques, pruning, or any other management that happens between planting and harvesting";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_processing_storage":
      try {
        tag = "post";
        description = "Posts about canning, smoking, root cellars, etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_livestock":
      try {
        tag = "post";
        description = "Posts related to livestock";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_soil":
      try {
        tag = "post";
        description =
          "Posts about composting techniques, soil building and maintenance, etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_propogation_cultivation":
      try {
        tag = "post";
        description =
          "Posts about seed propogation, collection, and storage. Or posts related to growing a species e.g. tree nursery information, etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_irrigation":
      try {
        tag = "post";
        description = "Posts related to getting water where it needs to go";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_technique_system":
      try {
        tag = "post";
        description =
          "Posts about specific farming practices/systems/techniques that you employ e.g. permaculture etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "agriculture_lifecycle":
      try {
        tag = "post";
        description =
          "Deep dives on one specific crop or species all the way through it's entire lifecycle.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_foundation":
      try {
        tag = "post";
        description = "Posts related to foundations";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_floor":
      try {
        tag = "post";
        description = "Posts related to floors";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_wall":
      try {
        tag = "post";
        description = "Posts related to building walls";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_roof":
      try {
        tag = "post";
        description = "Posts related to roofing";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_complete_structure":
      try {
        tag = "post";
        description =
          "Posts related to the start-to-finish process of a building project e.g. fencing, outhouses, decks, pavilions, etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_water_system":
      try {
        tag = "post";
        description =
          "Posts related water systems for a house or in the environment e.g plumbing, ponds, etc.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_heat_cool":
      try {
        description = "Posts related to heating and cooling";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_sanitation":
      try {
        tag = "post";
        description = "Posts related to sanitation";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "build_tool":
      try {
        tag = "post";
        description =
          "Posts about how to make or use furniture, utensils or any type of tool";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "culture_cook_recipes":
      try {
        tag = "post";
        description =
          "Posts related to recipes or cooking processes and techniques.";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "culture_clothing":
      try {
        tag = "post";
        description =
          " Posts about how to make clothing, from tanning to sewing, as well as styling";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "culture_art":
      try {
        tag = "post";
        description =
          "Posts related to art that isn't music (sculpting, painting, etc.)";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "culture_music":
      try {
        tag = "post";
        description =
          "Songs perhaps but also posts about how to make and use instruments";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "culture_ritual":
      try {
        tag = "post";
        description =
          "Posts related to rituals whether it be religious or otherwise";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "culture_story":
      try {
        tag = "post";
        description = "Post related to storytelling";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    default:
      // try {
      //   description = null;
      //   category = await getPostsByCategoryAndRegion(categoryQuery, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
  }

  // const species = await getMammals("Mammalia", "313");
  // console.log(category);

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      title: categoryTitle,
      id: id,
      description: description,
      tag: tag,
    },
  };
};

export default categoryList;
