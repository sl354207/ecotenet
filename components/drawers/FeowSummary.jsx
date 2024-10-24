import Link from "@components/layouts/Link";
import { Button, CircularProgress, Typography } from "@mui/material";
import fetcher from "@utils/fetcher";
import useSWR from "swr";

const FeowSummary = ({ ecoFilter }) => {
  const {
    data: results,
    isLoading,
    error,
    mutate,
  } = useSWR(
    ecoFilter && ecoFilter.layer === "feow"
      ? `/api/ecoregions/${ecoFilter._id}?layer=${ecoFilter.layer}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  return (
    <>
      {ecoFilter && ecoFilter.layer === "feow" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
              FEOW-{ecoFilter._id}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ marginBottom: "15px" }}
            >
              {ecoFilter.name}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Source:{" "}
              <Link
                href={`https://www.feow.org/ecoregions/details/${ecoFilter._id}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                FEOW
              </Link>
            </Typography>
          </div>
          {isLoading ? (
            <CircularProgress
              color="secondary"
              size={50}
              disableShrink={true}
              sx={{
                margin: "10px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              {error ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate()}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {results && (
                    <>
                      {results.habitat && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Major Habitat Type:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.habitat}
                          </Typography>
                        </>
                      )}
                      {results.drainage && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Drainages flowing into:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.drainage}
                          </Typography>
                        </>
                      )}
                      {results.rivers && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Main rivers to other water bodies:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.rivers}
                          </Typography>
                        </>
                      )}
                      {results.boundaries && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Boundaries:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.boundaries}
                          </Typography>
                        </>
                      )}
                      {results.topography && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Topography:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.topography}
                          </Typography>
                        </>
                      )}
                      {results.freshwater && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Freshwater habitats:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.freshwater}
                          </Typography>
                        </>
                      )}
                      {results.terrestrial && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Terrestrial habitats:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.terrestrial}
                          </Typography>
                        </>
                      )}
                      {results.fishes && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Description of endemic fishes:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.fishes}
                          </Typography>
                        </>
                      )}
                      {results.phenomena && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Ecological phenomena:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.phenomena}
                          </Typography>
                        </>
                      )}
                      {results.justification && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Justification for delineation:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.justification}
                          </Typography>
                        </>
                      )}
                      {results.authors && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>Authors:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px" }}
                          >
                            {results.authors}
                          </Typography>
                        </>
                      )}
                      {results.references && (
                        <>
                          <Typography variant="h6" sx={{ marginTop: "20px" }}>
                            <b>References:</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "10px", overflowWrap: "anywhere" }}
                          >
                            {results.references}
                          </Typography>
                        </>
                      )}
                      <Typography variant="h6" sx={{ marginTop: "20px" }}>
                        <b>Copyright:</b>
                      </Typography>
                      <Typography variant="body1" sx={{ marginTop: "10px" }}>
                        Copyright 2008 by The Nature Conservancy and World
                        Wildlife Fund, Inc. All Rights Reserved. Freshwater
                        Ecoregions of the World (FEOW) has been jointly
                        developed by the Conservation Science Program of World
                        Wildlife Fund and by The Nature Conservancy. Some
                        content on this site may be the property of independent
                        authors and contributors, who may be identified in
                        separate copyright notices associated with content
                        provided by them. You may not copy, reproduce, modify,
                        display, republish, upload, post, transmit, distribute,
                        alter, prepare any derivative works of, or otherwise use
                        any material from this web site, including without
                        limitation text, code, software, photographs, and
                        images, without the prior express written consent of The
                        Nature Conservancy or World Wildlife Fund, except as
                        described below. You may use the content for
                        non-commercial, educational, or scientific conservation
                        purposes, provided that: (1) The above copyright notice
                        or any separate copyright notice that appears with the
                        content must appear on all copies, along with a citation
                        (and a link, in the case of online use) to{" "}
                        <Link
                          href="http://www.feow.org"
                          target="_blank"
                          rel="noreferrer"
                          underline="hover"
                        >
                          http://www.feow.org
                        </Link>
                        ; (2) you may use only so much of the content as is
                        reasonably necessary to accomplish your non-commercial,
                        educational, or scientific purpose; (3) you may not make
                        any material modifications to the portion of the content
                        you use; and (4) you may not use graphics or photographs
                        separately from the accompanying text. Neither The
                        Nature Conservancy nor World Wildlife Fund warrants or
                        represents that the use of materials contained on this
                        web site will not infringe the rights of third parties.
                        Except as expressly granted above, all rights are
                        reserved.
                      </Typography>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
          Please select a freshwater ecoregion from the map or ecoregions tab to
          view a summary
        </Typography>
      )}
    </>
  );
};

export default FeowSummary;
