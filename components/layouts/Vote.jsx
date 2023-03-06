import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { alpha, Button, IconButton, Typography } from "@mui/material";
import theme from "@utils/theme";
import { useState } from "react";

const Vote = ({
  post_count,
  handleOpenDialog,
  voters,
  limit,
  setLimit,
  vote,
  setVote,
}) => {
  //set count value for voting
  const [count, setCount] = useState(post_count);

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
    <div
      style={{
        display: "flex",
        border: `2px solid ${alpha(theme.palette.secondary.main, 1)}`,
        borderRadius: "4px",
        padding: "10px",
      }}
    >
      <div style={{ display: "flex" }}>
        <IconButton
          onClick={handleCountUp}
          color="secondary"
          size="small"
          disabled={!voters}
          sx={{ border: "1px solid", marginInline: "5px" }}
        >
          <ArrowDropUp fontSize="large" />
        </IconButton>
        <Typography
          align="center"
          sx={{ marginBlock: "auto", marginInline: "10px" }}
        >
          {count}
        </Typography>
        <IconButton
          onClick={handleCountDown}
          color="secondary"
          size="small"
          disabled={!voters}
          sx={{ border: "1px solid", marginInline: "5px" }}
        >
          <ArrowDropDown fontSize="large" />
        </IconButton>
      </div>

      {count !== post_count ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDialog("Vote", { vote: vote })}
          size="small"
          sx={{ marginBlock: "auto" }}
        >
          Vote
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          sx={{ marginBlock: "auto" }}
          disabled
        >
          Vote
        </Button>
      )}
    </div>
  );
};

export default Vote;
