import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

import { useRouter } from "next/router";
import { useState } from "react";

const Notify = ({
  open,
  handleClose,
  type,
  action,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  name,
  result,
  setSnackbar,
  mutate,
}) => {
  const router = useRouter();

  const [reason, setReason] = useState("language");

  const handleChange = (event) => {
    setReason(event.target.value);
  };

  // function to delete post by id
  const deleteItem = async () => {
    if (type == "post") {
      const res = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result._id),
      });

      if (res.ok) {
        const notify = {
          name: name,
          reason: reason,
          text: `a post of yours was deleted for a ${reason} violation`,
          ref: result._id,
        };

        const res1 = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notify),
        });

        if (res1.ok) {
          mutate();
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: "Post deleted successfully",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem deleting post. Please try again later",
          });
        }
      }
    } else {
      const res = await fetch("/api/deleteComment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result._id),
      });
      if (res.ok) {
        const notify = {
          name: name,
          reason: reason,
          text: `a comment of yours was deleted for a ${reason} violation`,
          ref: result._id,
        };

        const res1 = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notify),
        });

        if (res1.ok) {
          mutate();
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: "Comment deleted successfully",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem deleting comment. Please try again later",
          });
        }
      }
    }
  };

  // ADD ERROR SNACKBAR
  const deny = async () => {
    if (type == "post") {
      const submission = {
        title: result.title,
        description: result.description,
        category: result.category,
        tags: result.tags,
        ecoregions: result.ecoregions,
        _id: result._id,
        id: result.id,
        version: result.version,
        rows: result.rows,
        status: result.status,
        approved: "false",
        updated: result.updated,
        featured: result.featured,
        date: result.date,
        feature: "false",
      };

      const res = await fetch("/api/updatePost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (res.ok) {
        const notify = {
          name: name,
          reason: reason,
          text: `a post of yours was denied for a ${reason} violation`,
          ref: result._id,
        };

        const res1 = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notify),
        });

        if (res1.ok) {
          mutate();
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: "Post denied successfully",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: "There was a problem denying post. Please try again later",
          });
        }
      }
    } else {
      const comment = {
        date: result.date,
        text: result.text,
        approved: "false",
        updated: result.updated,
      };
      const res = await fetch("/api/updateComment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      if (res.ok) {
        const notify = {
          name: name,
          reason: reason,
          text: `a comment of yours was denied for a ${reason} violation`,
          ref: result._id,
        };

        const res1 = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notify),
        });

        if (res1.ok) {
          mutate();
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: "Comment denied successfully",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem denying comment. Please try again later",
          });
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabeledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogTitle
        id={id}
        className={className}
        color="textPrimary"
        align="center"
      >
        {action}
      </DialogTitle>
      <DialogContent className={className}>
        <FormControl component="fieldset">
          <FormLabel component="legend" color="secondary" focused={true}>
            Reason
          </FormLabel>
          <RadioGroup
            aria-label="reason"
            name="reason"
            value={reason}
            onChange={handleChange}
            row
          >
            <FormControlLabel
              value="language"
              control={<Radio />}
              label="Language"
            />
            <FormControlLabel value="link" control={<Radio />} label="Link" />
            <FormControlLabel
              value="citation"
              control={<Radio />}
              label="Citation"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={action == "Deny" ? () => deny() : () => deleteItem()}
          color="secondary"
          variant="outlined"
        >
          {action == "Deny" ? "Deny" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Notify;
