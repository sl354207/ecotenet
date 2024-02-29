import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
  alpha,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Vote = ({
  handleOpenDialog,
  id,
  limit,
  setLimit,
  vote,
  setVote,
  isMobile,
}) => {
  //set count value for voting
  const [count, setCount] = useState(0);

  const {
    data: votes,
    isLoading: voteLoading,
    error: voteError,
    mutate,
  } = useSWR(`/api/votes/${id}`, fetcher, {
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (votes && votes.count) {
      setCount(votes.count);
    }
    setLimit(0);
  }, [votes, isMobile]);

  const handleCountUp = () => {
    if (limit === 1) {
      setLimit(1);
      setCount(count);
    } else {
      setLimit(limit + 1);
      setCount(count + 1);
      setVote("add");
    }
  };

  const handleCountDown = () => {
    if (count === 0 && limit === 0) {
      setLimit(0);
      setCount(count);
    } else if (limit === -1) {
      setLimit(limit);
      setCount(count);
    } else {
      setLimit(limit - 1);
      setCount(count - 1);
      setVote("subtract");
    }
  };
  return (
    <div data-testid="vote-container">
      {voteLoading ? (
        <CircularProgress size={19} color="secondary" />
      ) : (
        <>
          {voteError ? (
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
                onClick={() => mutate(`/api/votes/${id}`)}
              >
                Error Loading. Retry
              </Button>
            </div>
          ) : (
            <>
              {votes && (
                <div
                  style={{
                    display: "flex",
                    border: `2px solid ${alpha(
                      theme.palette.secondary.main,
                      1
                    )}`,
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <IconButton
                      onClick={handleCountUp}
                      color="secondary"
                      size="small"
                      disabled={!votes.voters}
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
                      disabled={!votes.voters}
                      sx={{ border: "1px solid", marginInline: "5px" }}
                    >
                      <ArrowDropDown fontSize="large" />
                    </IconButton>
                  </div>

                  {count !== votes.count ? (
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Vote;
