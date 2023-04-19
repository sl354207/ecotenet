import AdminDialog from "@components/dialogs/AdminDialog";
import Resolve from "@components/dialogs/Resolve";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import fetcher from "@utils/fetcher";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const person = () => {
  const router = useRouter();

  const name = router.query.name;

  const flag = router.query.flag;

  const flagee = router.query.flagee;

  const [dialog, setDialog] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");
  const { mutate } = useSWRConfig();

  const handleOpenDialog = (action, type, result) => {
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleOpenResolve = () => {
    setResolve(true);
  };

  const handleCloseResolve = () => {
    setResolve(false);
  };

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(name ? `/api/admin/users/${name}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  let person;

  if (isLoading) {
    person = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    if (error) {
      person = (
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
            onClick={() => mutate(`/api/admin/users/${name}`)}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      person = (
        <>
          {results && (
            <>
              <Header title={results.name} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleOpenResolve()}
              >
                Resolve
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginLeft: "4px" }}
                onClick={() => handleOpenDialog("Deny", "Person", results)}
              >
                Deny
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  marginLeft: "4px",
                  color: "#fc7ebf",
                  borderColor: "#fc7ebf",
                }}
                onClick={() => handleOpenDialog("Delete", "Person", results)}
              >
                Delete
              </Button>

              <div style={{ margin: "16px" }}>
                {results.bio !== "" && (
                  <>
                    <Typography gutterBottom>Bio:</Typography>
                    <Typography gutterBottom variant="body1">
                      {results.bio}
                    </Typography>
                  </>
                )}
                {results.website !== "" && (
                  <Typography gutterBottom>
                    Personal Website:{" "}
                    <Link href={results.website} underline="hover">
                      {results.website}
                    </Link>
                  </Typography>
                )}
                {Array.isArray(results.socials) &&
                  results.socials.length > 0 && (
                    <Typography sx={{ display: "grid" }} gutterBottom>
                      Socials:{" "}
                      {results.socials.map((social) => (
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={social}
                          underline="hover"
                          key={social}
                        >
                          {social}
                        </Link>
                      ))}
                    </Typography>
                  )}
              </div>
            </>
          )}
        </>
      );
    }
  }
  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <Link
        href="/admin/flags"
        underline="hover"
        style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
      >
        <ArrowBackIcon fontSize="small" />
        Flags
      </Link>
      <Container>
        {person}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          result={item}
        />
        <Resolve
          open={resolve}
          handleClose={handleCloseResolve}
          name={flagee}
          ID={flag}
          route="name"
        />
      </Container>
    </>
  );
};

export default person;
