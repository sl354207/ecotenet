import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";

// const useStyles = makeStyles(() => ({
//   // root: {
//   //   marginLeft: 20,
//   // },
//   // count: {
//   //   display: "flex",
//   //   flexDirection: "column",
//   //   maxWidth: 50,
//   // },
// }));

const Vote = ({
  post_count,
  count,
  setCount,
  handleOpenDialog,
  voters,
  name,
}) => {
  // const classes = useStyles();

  //set limit for count
  const [limit, setLimit] = useState(0);

  const handleCountUp = () => {
    if (limit == 1) {
      setLimit(1);
      setCount(count);
    } else {
      setLimit(limit + 1);
      setCount(count + 1);
    }
  };

  const handleCountDown = () => {
    if (count == 0) {
      setLimit(0);
      setCount(count);
    } else if (limit == -1) {
      setLimit(limit);
      setCount(count);
    } else {
      setLimit(limit - 1);
      setCount(count - 1);
    }
  };
  return (
    <>
      <div
        // className={classes.root}
        style={{ marginLeft: "20px" }}
      >
        <div
          // className={classes.count}
          style={{ display: "flex", flexDirection: "column", maxWidth: "50px" }}
        >
          <IconButton
            onClick={handleCountUp}
            color="secondary"
            size="large"
            disabled={voters.includes(name)}
          >
            <ArrowDropUp fontSize="large" />
          </IconButton>
          <Typography align="center">{count}</Typography>
          <IconButton
            onClick={handleCountDown}
            color="secondary"
            size="large"
            disabled={voters.includes(name)}
          >
            <ArrowDropDown fontSize="large" />
          </IconButton>
        </div>
      </div>
      {count !== post_count ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            handleOpenDialog("Vote", { count: count, voters: voters })
          }
        >
          Vote
        </Button>
      ) : (
        <Button variant="contained" color="secondary" disabled>
          Vote
        </Button>
      )}
    </>
  );
};

export default Vote;
