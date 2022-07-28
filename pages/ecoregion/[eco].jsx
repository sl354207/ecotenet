// UPDATE TO ECOREGION INDEX OR SOMETHING
import Flag from "@components/dialogs/Flag";
import Footer from "@components/Footer";
import Header from "@components/Header";
import Link from "@components/Link";
import { useUserContext } from "@components/UserContext";
import FlagIcon from "@mui/icons-material/Flag";
import { Container, IconButton, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { getEcoregion } from "@utils/mongodb";
import theme from "@utils/theme";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  // tableRow: {
  //   backgroundColor: "#001e3c!important",
  //   textAlign: "center",
  //   color: "#ffffff!important",
  // },
  // table: {
  //   [theme.breakpoints.down("sm")]: {
  //     margin: "auto",
  //     float: "none",
  //   },
  //   float: "right",
  //   border: "thin solid",
  //   marginLeft: 10,
  // },
  // description: {
  //   marginBottom: 40,
  // },
  // flagBox: {
  //   display: "flex",
  //   justifyContent: "center",
  // },
  // spacer: {
  //   display: "flex",
  //   marginRight: "auto",
  //   visibility: "hidden",
  //   minWidth: 30,
  // },
  // flag: {
  //   display: "flex",
  //   marginLeft: "auto",
  //   marginTop: "auto",
  //   marginBottom: "auto",
  // },
  // header: {
  //   marginTop: 20,
  // },
}));

const eco = ({ wiki, ecoName, id }) => {
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
            underline="hover"
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
          <table
            {...props}
            // className={classes.table}
            style={{
              [theme.breakpoints.down("sm")]: {
                margin: "auto",
                float: "none",
              },
              float: "right",
              border: "thin solid",
              marginLeft: 10,
            }}
          >
            {domToReact(domNode.children, options)}
          </table>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "th") {
        const props = attributesToProps(domNode.attribs);
        return (
          <th
            {...props}
            // className={classes.tableRow}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
            {domToReact(domNode.children, options)}
          </th>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "tr") {
        const props = attributesToProps(domNode.attribs);
        return (
          <tr
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
            {domToReact(domNode.children, options)}
          </tr>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "td") {
        const props = attributesToProps(domNode.attribs);
        return (
          <td
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
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
          <div
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
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
        <div
          // className={classes.flagBox}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            // className={classes.spacer}
            style={{
              display: "flex",
              marginRight: "auto",
              visibility: "hidden",
              minWidth: 30,
            }}
          ></div>
          <Header
            title={`Eco-${id}: ${ecoName}`}
            // className={classes.description}
            sx={{ marginBottom: "40px" }}
          />
          <IconButton
            // className={classes.flag}
            sx={{
              display: "flex",
              marginLeft: "auto",
              marginTop: "auto",
              marginBottom: "auto",
            }}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenDialog()}
          >
            <FlagIcon />
          </IconButton>
        </div>

        {!wiki ? (
          <Typography
            variant="h6"
            align="justify"
            // className={classes.header}
            sx={{ marginTop: 20 }}
          >
            We currently don't have a summary of this ecoregion. If you want to
            help us out you can create a wikipedia page for the ecoregion.
          </Typography>
        ) : (
          <>
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
          </>
        )}

        {/* UPDATE */}
        <Flag
          open={dialog}
          handleClose={() => handleCloseDialog()}
          contentType="ecoregion"
          result={{ _id: "test" }}
          name={user && user.name}
        />
      </Container>
      <Footer />
    </>
  );
};

// CHANGE to static potentially
export const getServerSideProps = async (context) => {
  // console.log(context);
  const id = context.params.eco;
  // const id = context.query.id;

  const eco = await getEcoregion(id);
  // const ecoName = eco.name
  const unSlug = eco.name.replace(" ", "_");
  // console.log(typeof eco.name);

  let wikiRes;
  let wiki;

  switch (eco.url) {
    case undefined:
      wikiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${unSlug}?redirect=true`,
        {
          method: "GET",
          headers: {
            // Authorization:
            //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmMWJmYjJlYmRjMjdjNDMxYjdiZDIzNjI0MWZhMGZkOSIsImp0aSI6IjdkMmI3NmZkNDFjNWU4NTcwZDgwYzY2MTgwOGMyZDI2Y2NjNzE0YjMwODJkODI1N2M5N2Q0NjVhZWQwMGMwNmZiOTljYTY5OGFkZWY4ZWY2IiwiaWF0IjoxNjQzMzA5NDAyLCJuYmYiOjE2NDMzMDk0MDIsImV4cCI6MzMyMDAyMTgyMDIsInN1YiI6IjY4Nzc3MDgxIiwiaXNzIjoiaHR0cHM6XC9cL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.bIwXFgnWnc3_DNAkcBucrzwVnMAmQHKt_eoZuAwmYMZ7dvobReLNxP28D8C_VfAP7EOSSP7PmrkHAeQUDlY_qOXpLLe8Ls1FdTVmjFeXAQFm3dBtVDJe9FDc_Lnkqfb0zqV_OYZRdm_oDIqu16sItrhqQEkxAGQxdpaObWPQO4A8XcRhe0YrE82uFxTydTOO2RG910x9AkctxeyslzItr-qB5Gdz7pgua3YLaNSB0zcK0_D98_oSw61r7OQDT0L2xI_3DbIBbPlI1Lz0hbQVpzlEDxXp9v6GHFWu4VXaO27Mrr3XRegyo0tstid-wLtvjSdxphd8mdnrYhxT3PX9UZV5gotqC3BCnJlDdev_4q9QZjY-5n7aJbPSHC43aauZfUHrKDCp5y_ocxxS5eisG7ptqMRE1kflWIzLpzdDi1_UkBz-xqMuTnBVKNCf7aY45boDYI-aNfJt0nF2ujKSB76gsSI0-AyKJUBYj7PDvGcc5tyx4jK0EZzihCK3itTwhJE7JBfgCCyvgXtpQ8hGHSJyMnYBZci_ejwOK4-HwSIGhZV2QF0sJZat80LPq6vzt5omYnNZ9qUO02n7t_zegCZM-kwf0roOXhBgMSVkhbzConYTvh4sQPi1_LP77rbnPM96rWMF9hpCICB6Z2-e2KvSIJZwgA8rRx-nhJBAvq8",
            "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
          },
        }
      );

      wiki = await wikiRes.json();

      break;
    case "undefined":
      wiki = undefined;

      break;

    default:
      wikiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${eco.url.replace(
          " ",
          "_"
        )}?redirect=true`,
        {
          method: "GET",
          headers: {
            // Authorization:
            //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmMWJmYjJlYmRjMjdjNDMxYjdiZDIzNjI0MWZhMGZkOSIsImp0aSI6IjdkMmI3NmZkNDFjNWU4NTcwZDgwYzY2MTgwOGMyZDI2Y2NjNzE0YjMwODJkODI1N2M5N2Q0NjVhZWQwMGMwNmZiOTljYTY5OGFkZWY4ZWY2IiwiaWF0IjoxNjQzMzA5NDAyLCJuYmYiOjE2NDMzMDk0MDIsImV4cCI6MzMyMDAyMTgyMDIsInN1YiI6IjY4Nzc3MDgxIiwiaXNzIjoiaHR0cHM6XC9cL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.bIwXFgnWnc3_DNAkcBucrzwVnMAmQHKt_eoZuAwmYMZ7dvobReLNxP28D8C_VfAP7EOSSP7PmrkHAeQUDlY_qOXpLLe8Ls1FdTVmjFeXAQFm3dBtVDJe9FDc_Lnkqfb0zqV_OYZRdm_oDIqu16sItrhqQEkxAGQxdpaObWPQO4A8XcRhe0YrE82uFxTydTOO2RG910x9AkctxeyslzItr-qB5Gdz7pgua3YLaNSB0zcK0_D98_oSw61r7OQDT0L2xI_3DbIBbPlI1Lz0hbQVpzlEDxXp9v6GHFWu4VXaO27Mrr3XRegyo0tstid-wLtvjSdxphd8mdnrYhxT3PX9UZV5gotqC3BCnJlDdev_4q9QZjY-5n7aJbPSHC43aauZfUHrKDCp5y_ocxxS5eisG7ptqMRE1kflWIzLpzdDi1_UkBz-xqMuTnBVKNCf7aY45boDYI-aNfJt0nF2ujKSB76gsSI0-AyKJUBYj7PDvGcc5tyx4jK0EZzihCK3itTwhJE7JBfgCCyvgXtpQ8hGHSJyMnYBZci_ejwOK4-HwSIGhZV2QF0sJZat80LPq6vzt5omYnNZ9qUO02n7t_zegCZM-kwf0roOXhBgMSVkhbzConYTvh4sQPi1_LP77rbnPM96rWMF9hpCICB6Z2-e2KvSIJZwgA8rRx-nhJBAvq8",
            "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
          },
        }
      );

      wiki = await wikiRes.json();

      break;
  }

  // console.log(objectData);

  // const id = context.params.id;
  // const wikiRes = await fetch(!eco.url ? `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${unSlug}?redirect=true`: `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${ecoName}?redirect=true`
  //   ,
  //   {
  //     method: "GET",
  //     headers: {
  //       // Authorization:
  //       //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmMWJmYjJlYmRjMjdjNDMxYjdiZDIzNjI0MWZhMGZkOSIsImp0aSI6IjdkMmI3NmZkNDFjNWU4NTcwZDgwYzY2MTgwOGMyZDI2Y2NjNzE0YjMwODJkODI1N2M5N2Q0NjVhZWQwMGMwNmZiOTljYTY5OGFkZWY4ZWY2IiwiaWF0IjoxNjQzMzA5NDAyLCJuYmYiOjE2NDMzMDk0MDIsImV4cCI6MzMyMDAyMTgyMDIsInN1YiI6IjY4Nzc3MDgxIiwiaXNzIjoiaHR0cHM6XC9cL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.bIwXFgnWnc3_DNAkcBucrzwVnMAmQHKt_eoZuAwmYMZ7dvobReLNxP28D8C_VfAP7EOSSP7PmrkHAeQUDlY_qOXpLLe8Ls1FdTVmjFeXAQFm3dBtVDJe9FDc_Lnkqfb0zqV_OYZRdm_oDIqu16sItrhqQEkxAGQxdpaObWPQO4A8XcRhe0YrE82uFxTydTOO2RG910x9AkctxeyslzItr-qB5Gdz7pgua3YLaNSB0zcK0_D98_oSw61r7OQDT0L2xI_3DbIBbPlI1Lz0hbQVpzlEDxXp9v6GHFWu4VXaO27Mrr3XRegyo0tstid-wLtvjSdxphd8mdnrYhxT3PX9UZV5gotqC3BCnJlDdev_4q9QZjY-5n7aJbPSHC43aauZfUHrKDCp5y_ocxxS5eisG7ptqMRE1kflWIzLpzdDi1_UkBz-xqMuTnBVKNCf7aY45boDYI-aNfJt0nF2ujKSB76gsSI0-AyKJUBYj7PDvGcc5tyx4jK0EZzihCK3itTwhJE7JBfgCCyvgXtpQ8hGHSJyMnYBZci_ejwOK4-HwSIGhZV2QF0sJZat80LPq6vzt5omYnNZ9qUO02n7t_zegCZM-kwf0roOXhBgMSVkhbzConYTvh4sQPi1_LP77rbnPM96rWMF9hpCICB6Z2-e2KvSIJZwgA8rRx-nhJBAvq8",
  //       "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
  //     },
  //   }
  // );

  // const wiki = await wikiRes.json();
  // console.log(eco.name);
  // console.log(id);

  return {
    props: {
      wiki:
        wiki == undefined || wiki.title == "Not found."
          ? null
          : JSON.parse(JSON.stringify(wiki)),
      ecoName: eco.name,
      id: id,
    },
  };
};

export default eco;
