import { Button, IconButton, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 20,
  },
  count: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 50,
  },
}));

const Vote = ({ post_count, count, setCount, handleOpenDialog }) => {
  const classes = useStyles();

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
  return <>
    <div className={classes.root}>
      <div className={classes.count}>
        <IconButton onClick={handleCountUp} color="secondary" size="large">
          <ArrowDropUp fontSize="large" />
        </IconButton>
        <Typography align="center">{count}</Typography>
        <IconButton onClick={handleCountDown} color="secondary" size="large">
          <ArrowDropDown fontSize="large" />
        </IconButton>
      </div>
    </div>
    {count !== post_count ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpenDialog("Vote", count)}
      >
        Vote
      </Button>
    ) : (
      <Button variant="contained" color="secondary" disabled>
        Vote
      </Button>
    )}
  </>;
};

export default Vote;
