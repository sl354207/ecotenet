import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";

const Vote = ({
  post_count,
  count,
  setCount,
  handleOpenDialog,
  voters,
  name,
}) => {
  //set limit for count
  const [limit, setLimit] = useState(0);
  const [vote, setVote] = useState(0);

  const handleCountUp = () => {
    if (limit == 1) {
      setLimit(1);
      setCount(count);
    } else {
      setLimit(limit + 1);
      setCount(count + 1);
      setVote("add");
    }
  };

  const handleCountDown = () => {
    if (count == 0 && limit == 0) {
      setLimit(0);
      setCount(count);
    } else if (limit == -1) {
      setLimit(limit);
      setCount(count);
    } else {
      setLimit(limit - 1);
      setCount(count - 1);
      setVote("subtract");
    }
  };
  return (
    <>
      <div style={{ marginLeft: "20px" }}>
        <div
          style={{ display: "flex", flexDirection: "column", maxWidth: "50px" }}
        >
          <IconButton
            onClick={handleCountUp}
            color="secondary"
            size="large"
            disabled={!voters}
          >
            <ArrowDropUp fontSize="large" />
          </IconButton>
          <Typography align="center">{count}</Typography>
          <IconButton
            onClick={handleCountDown}
            color="secondary"
            size="large"
            disabled={!voters}
          >
            <ArrowDropDown fontSize="large" />
          </IconButton>
        </div>
      </div>
      {count !== post_count ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDialog("Vote", { vote: vote })}
          size="small"
        >
          Vote
        </Button>
      ) : (
        <Button variant="contained" color="secondary" size="small" disabled>
          Vote
        </Button>
      )}
    </>
  );
};

export default Vote;
