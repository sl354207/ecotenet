// UPDATE TO ECORGEGION INDEX OR SOMETHING
import Flag from "@components/dialogs/Flag";
import Footer from "@components/Footer";
import Header from "@components/Header";
import { useUserContext } from "@components/UserContext";
import { Container, IconButton, Link, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FlagIcon from "@material-ui/icons/Flag";
import { Alert } from "@material-ui/lab";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  tableRow: {
    backgroundColor: "#001e3c!important",
    textAlign: "center",
    color: "#ffffff!important",
  },
  table: {
    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      float: "none",
    },
    float: "right",
    border: "thin solid",
    marginLeft: 10,
  },
  description: {
    marginBottom: 40,
  },
  flagBox: {
    display: "flex",
    justifyContent: "center",
  },
  spacer: {
    display: "flex",
    marginRight: "auto",
    visibility: "hidden",
    minWidth: 30,
  },
  flag: {
    display: "flex",
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
}));

const success = ({ wiki }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUserContext();
  // console.log(userName);
  let status;
  if (user == undefined) {
    status = "loading";
  } else {
    status = user.status;
  }

  const [dialog, setDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = () => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        setDialog(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const options = {
    replace: (domNode) => {
      // console.log(domNode);
      if (domNode.attribs && domNode.children && domNode.name === "a") {
        const props = attributesToProps(domNode.attribs);
        return (
          <Link
            {...props}
            href={"https://en.wikipedia.org/" + domNode.attribs.href}
            color="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {domToReact(domNode.children, options)}
          </Link>
        );
      }
      if (domNode.attribs && domNode.attribs.role === "note") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.role === "presentation") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.role === "navigation") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "noviewer") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class == "gallerybox") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class == "metadata mbox-small") {
        return <></>;
      }
      if (
        domNode.attribs &&
        domNode.attribs.class === "wikitable mw-collapsible"
      ) {
        return <></>;
      }
      if (domNode.attribs && domNode.children && domNode.name === "table") {
        const props = attributesToProps(domNode.attribs);
        return (
          <table {...props} className={classes.table}>
            {domToReact(domNode.children, options)}
          </table>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "th") {
        const props = attributesToProps(domNode.attribs);
        return (
          <th {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </th>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "tr") {
        const props = attributesToProps(domNode.attribs);
        return (
          <tr {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </tr>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "td") {
        const props = attributesToProps(domNode.attribs);
        return (
          <td {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </td>
        );
      }
      if (
        domNode.attribs &&
        domNode.children &&
        domNode.attribs.class === "plainlist"
      ) {
        const props = attributesToProps(domNode.attribs);
        return (
          <div {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </div>
        );
      }

      if (domNode.attribs && domNode.children && domNode.name === "figure") {
        return <></>;
      }
      if (domNode.attribs && domNode.children && domNode.name === "style") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "thumbinner") {
        return <></>;
      }
    },
  };

  return (
    <>
      <Container>
        <div className={classes.flagBox}>
          <div className={classes.spacer}></div>
          <Header
            title="Eco-313: Appalachian mixed mesophytic forests"
            className={classes.description}
          />
          <IconButton
            className={classes.flag}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenDialog()}
          >
            <FlagIcon />
          </IconButton>
        </div>

        {parse(DOMPurify.sanitize(wiki.lead.sections[0].text), options)}
        {wiki.remaining.sections.map((section) => {
          if (section.anchor == "Gallery") {
            return <></>;
          } else if (section.toclevel == 2) {
            return (
              <>
                <h2>{section.line}</h2>
                {parse(DOMPurify.sanitize(section.text), options)}
              </>
            );
          } else {
            return (
              <>
                <h1>{section.line}</h1>
                {parse(DOMPurify.sanitize(section.text), options)}
              </>
            );
          }
        })}
        {/* UPDATE */}
        <Flag
          open={dialog}
          handleClose={() => handleCloseDialog()}
          contentType="ecoregion"
          result={{ _id: "test" }}
          setSnackbar={setSnackbar}
          name={user.name}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

// CHANGE
export const getServerSideProps = async () => {
  const wikiRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/Appalachian_mixed_mesophytic_forests?redirect=true`,
    {
      method: "GET",
      headers: {
        // Authorization:
        //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmMWJmYjJlYmRjMjdjNDMxYjdiZDIzNjI0MWZhMGZkOSIsImp0aSI6IjdkMmI3NmZkNDFjNWU4NTcwZDgwYzY2MTgwOGMyZDI2Y2NjNzE0YjMwODJkODI1N2M5N2Q0NjVhZWQwMGMwNmZiOTljYTY5OGFkZWY4ZWY2IiwiaWF0IjoxNjQzMzA5NDAyLCJuYmYiOjE2NDMzMDk0MDIsImV4cCI6MzMyMDAyMTgyMDIsInN1YiI6IjY4Nzc3MDgxIiwiaXNzIjoiaHR0cHM6XC9cL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.bIwXFgnWnc3_DNAkcBucrzwVnMAmQHKt_eoZuAwmYMZ7dvobReLNxP28D8C_VfAP7EOSSP7PmrkHAeQUDlY_qOXpLLe8Ls1FdTVmjFeXAQFm3dBtVDJe9FDc_Lnkqfb0zqV_OYZRdm_oDIqu16sItrhqQEkxAGQxdpaObWPQO4A8XcRhe0YrE82uFxTydTOO2RG910x9AkctxeyslzItr-qB5Gdz7pgua3YLaNSB0zcK0_D98_oSw61r7OQDT0L2xI_3DbIBbPlI1Lz0hbQVpzlEDxXp9v6GHFWu4VXaO27Mrr3XRegyo0tstid-wLtvjSdxphd8mdnrYhxT3PX9UZV5gotqC3BCnJlDdev_4q9QZjY-5n7aJbPSHC43aauZfUHrKDCp5y_ocxxS5eisG7ptqMRE1kflWIzLpzdDi1_UkBz-xqMuTnBVKNCf7aY45boDYI-aNfJt0nF2ujKSB76gsSI0-AyKJUBYj7PDvGcc5tyx4jK0EZzihCK3itTwhJE7JBfgCCyvgXtpQ8hGHSJyMnYBZci_ejwOK4-HwSIGhZV2QF0sJZat80LPq6vzt5omYnNZ9qUO02n7t_zegCZM-kwf0roOXhBgMSVkhbzConYTvh4sQPi1_LP77rbnPM96rWMF9hpCICB6Z2-e2KvSIJZwgA8rRx-nhJBAvq8",
        "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
      },
    }
  );

  const wiki = await wikiRes.json();

  return {
    props: {
      wiki: JSON.parse(JSON.stringify(wiki)),
    },
  };
};

export default success;
