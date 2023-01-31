import AdminDialog from "@components/dialogs/AdminDialog";
import Resolve from "@components/dialogs/Resolve";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import fetcher from "@utils/fetcher";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

// pass in post and comments as props and create page for each post with corresponding comments
const person = () => {
  const router = useRouter();

  const name = router.query.name;

  const flag = router.query.flag;

  const flagee = router.query.flagee;

  const [dialog, setDialog] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

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

  const { data: results } = useSWR(
    name ? `/api/admin/users/${name}` : null,
    fetcher
  );

  let person;

  if (!results || results == undefined) {
    person = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    person = (
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
          sx={{ marginLeft: "4px", color: "#fc7ebf", borderColor: "#fc7ebf" }}
          onClick={() => handleOpenDialog("Delete", "Person", results)}
        >
          Delete
        </Button>
        {/* {results.approved == "true" && ( */}
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
          {Array.isArray(results.socials) && results.socials.length > 0 && (
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
        {/* )} */}
      </>
    );
  }
  return (
    <>
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
        />
      </Container>
    </>
  );
};

export default person;
