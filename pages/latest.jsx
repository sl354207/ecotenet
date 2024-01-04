import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import PostList from "@components/layouts/PostList";
import { Button, Container } from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import useSWRInfinite from "swr/infinite";
// UPDATE
const PAGE_SIZE = 2;
const latest = () => {
  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) => `/api/latest?page=${index + 1}`,
    fetcher,
    { revalidateFirstPage: false }
  );

  const posts = data ? [].concat(...data) : [];

  const isEmpty = data && data?.[size - 1]?.length === 0;

  const underPageSize = data && data?.[size - 1]?.length < PAGE_SIZE;

  const isReachingEnd = isEmpty || underPageSize;

  return (
    <>
      <NextSeo
        title="Latest Posts"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="These are the latest posts that people have shared on the site"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/latest",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo_social.png",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />

      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="Latest Posts" />

        {data && <PostList posts={data && posts} />}
        <Button
          disabled={isLoading || isReachingEnd}
          onClick={() => {
            setSize(size + 1);
          }}
          variant="outlined"
          color="secondary"
          sx={{ display: "block", margin: "auto" }}
        >
          {isLoading
            ? "loading..."
            : isReachingEnd
            ? "no more posts"
            : "load more"}
        </Button>
      </Container>
      <Footer />
    </>
  );
};

export default latest;
