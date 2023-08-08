import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

const ideas = () => {
  return (
    <>
      <NextSeo
        title="Purpose and Vision"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/ideas",
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
        <Header title="Ideas behind Ecotenet" />
        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Ecotenet Origins
        </Typography>
        <Typography variant="body1" gutterBottom>
          I&apos;ve always felt very connected to the place that I live, and in
          particular, the woods. This most likely stems from the countless hours
          I spent roaming those woods as a child, climbing trees and splashing
          through creek beds. And as I grew older, the urge to develop a deeper
          connection with my environment strengthened. The idea of interacting
          with my environment in a way that was beneficial to both sides. Give
          and take. A real relationship.
        </Typography>
        <Typography variant="body1">
          This idea, this feeling, I think is what planted the seed for
          Ecotenet. A space where people can learn and share their knowledge
          about nature that is connected to place.
        </Typography>

        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Species Distributions
        </Typography>
        <Typography variant="body1" gutterBottom>
          Someone once shared the idea of having a tool that could be used as an
          ID guide specifically for all the trees where you live. I thought it
          was an awesome idea and got to thinking on it a little more. I have
          seen many Birds of (insert your state here) resources, which are
          amazing, but because political boundaries mostly aren&apos;t connected
          to the natural world, much of the information in them wasn&apos;t
          applicable to my specific area.
        </Typography>
        <Typography variant="body1" gutterBottom>
          And then I stumbled upon ecoregions and the whole idea clicked. Why
          not map tree species to regions that are environmentally similar to
          yours. And why stop at trees or birds? Why not map all species?
          Luckily, there is a large amount of publicly available data on
          some(not all...yet) of these species.
        </Typography>
        <Typography variant="body1">And we&apos;re off!</Typography>

        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Human Interactions
        </Typography>
        <Typography variant="body1" gutterBottom>
          I feel like almost anyone who is interested in outdoor skills has read
          about starting a fire with a bow drill (for those who haven&apos;t, it
          is a primitive tool made from wood and cordage used to start a fire).
          I was reading one of these said articles and it listed about 5-10
          different species that I could use to create each component of the bow
          drill. I wasn&apos;t really sure which, if any, of these species were
          present where I lived so I had to do further research to find out.
        </Typography>
        <Typography variant="body1" gutterBottom>
          And then it clicked again. In my eyes, almost everything we do, how we
          interact with the world and each other, is in some way connected to
          our environment. And although this is becoming less clear through
          globalization and technology, everything from food to clothing to
          culture is connected to place.
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ marginBlock: "20px" }}>
          <b>A brief tangent on technology:</b> at first glance this may seem
          applicable mainly to primitive skills or interactions very closely
          tied to nature. And that technology(to be clear, I&apos;m using
          technology to mean machines and tools, not just computers and stuff)
          is removing the need for knowledge of place. But I see it a little
          differently. I think we are currently in a phase where we have used
          our technology to create generalized solutions to problems and then
          tried to scale those solutions into a one-size-fits-all model. But I
          think as our technology improves, the next phase will be creating
          specialized solutions to specialized problems, reconnecting us to
          place.
        </Typography>
        <Typography variant="body1" gutterBottom>
          I also feel that how we interact, whether we see it or not, is often
          connected to species. So it seems like an easy way to tie knowledge
          and place together when needed.
        </Typography>
        <Typography variant="body1">
          So what I really want is to have knowledge about how to make a bow
          drill, how to grow food, how to build things, and how to be connected
          to culture where I live, not just generally. Because why not?
        </Typography>

        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Ecoregions
        </Typography>
        <Typography variant="body1" gutterBottom>
          There are a couple of problems when trying to connect knowledge to
          ecological place; proper scale and reliable data.
        </Typography>
        <Typography variant="body1" gutterBottom>
          On the scale side, there are larger classifications like biomes and
          realms and smaller classifications that subdivide ecoregions. The
          larger classifications seemed slightly too broad to have the detail I
          was looking for. The smaller classifications seemed more detailed than
          the species data can reliably display, and also, just a little
          overwhelming when you have so many regions.
        </Typography>
        <Typography variant="body1">
          On the data side, the reliability is also related to scale. If you
          have one data point for a species in a larger classification, it
          becomes less likely that that species is present throughout the whole
          region(this is still a problem with ecoregions but less so). In a
          smaller classification it becomes more likely to say that a species is
          not present in a region simply because we haven&apos;t recorded it in
          that specific place. The same way that if I look out my front window
          and don&apos;t see a species and say &ldquo;it must not be present
          here&ldquo;, when in reality it could be right outside my back window.
          It would be very cool at some point to be able to draw a circle around
          an area of any size, big or small, and be able to know what species
          are present. But our species data just isn&apos;t that detailed yet,
          especially on a global scale.
        </Typography>

        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Voting
        </Typography>
        <Typography variant="body1" gutterBottom>
          Because how people interact with the world is so subjective in my
          eyes, it didn&apos;t make sense to make this similar to Wikipedia
          where a topic is created and then anyone can edit it. I think two
          people could write a post on the same topic and explore it in two
          completely different ways and each still be valid knowledge.
        </Typography>
        <Typography variant="body1" gutterBottom>
          But, I do think some information is better than others, whether it be
          in detail or delivery. So voting on a post is a way to display to
          viewers and authors how helpful the information is, generally or
          comparatively.
        </Typography>
        <Typography variant="body1">
          This system may or may not end up being valuable. It may be updated
          and improved upon. And like all of this, is up for discussion.
        </Typography>

        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Content Moderation
        </Typography>
        <Typography variant="body1">
          Currently all posts, comments, and profiles must be approved before
          being made public. We really want to make sure, especially at the
          beginning, that we are building a positive, inclusive community. At
          the moment this seems like the safest solution, but I think most
          likely will change in the future...not sure what to...again open to
          discussion.
        </Typography>

        <Typography align="center" variant="h5" sx={{ marginBlock: "10px" }}>
          Future Plans
        </Typography>
        <Typography variant="body1">
          I have a lot of ideas...the most concrete one that I think will happen
          is to add a forum so that communities can be built in the space and
          people can have more detailed discussions around topics. I also really
          like the idea of turning this into a decentralized platform where the
          content creators and contributors have complete control over the
          knowledge base. But we shall see...more to come.
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default ideas;
