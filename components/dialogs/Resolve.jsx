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

const Resolve = ({
  open,
  handleClose,
  contentType,
  action,
  className,
  result,
  setSnackbar,
  mutate,
}) => {
  let endpoint;
  let item;
  let submission;

  switch (contentType) {
    case "post":
      endpoint = "Post";
      item = "post";
      submission = {
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
        approved: action == "Deny" ? "false" : "true",
        updated: result.updated,
        featured: result.featured,
        date: result.date,
        feature: "false",
      };
      break;
    case "comment":
      endpoint = "Comment";
      item = "comment";
      submission = {
        _id: result._id,
        date: result.date,
        text: result.text,
        approved: action == "Deny" ? "false" : "true",
        updated: result.updated,
      };
      break;
    case "person":
      endpoint = "Person";
      item = "profile item";
      submission = {
        _id: result._id,
        name: result.name,
        bio: result.bio,
        email: result.email,
        website: result.website,
        socials: result.socials,
        flags: result.flags,
        denials: action == "Deny" ? result.denials + 1 : result.denials,
        approved: action == "Approve" ? "true" : "false",
      };
      break;
    default:
      break;
  }

  const [reason, setReason] = useState("language");

  const handleChange = (event) => {
    setReason(event.target.value);
  };

  const handleSubmit = async () => {
    if (action == "Delete") {
      const res = await fetch(`/api/delete${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          contentType == "person"
            ? JSON.stringify(result.name)
            : JSON.stringify(result._id),
      });

      if (res.ok && contentType !== "person") {
        const notify = {
          name: result.name,
          reason: reason,
          text: `a ${item} of yours was deleted for a ${reason} violation`,
          ref: result._id,
          date: new Date().toUTCString(),
          viewed: false,
        };

        const res1 = await fetch("/api/createNotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notify),
        });

        if (res1.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} deleted successfully`,
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem deleting ${endpoint}. Please try again later`,
          });
        }
      }
      if (!res.ok) {
        setSnackbar({
          open: true,
          severity: "error",
          message: `There was a problem deleting ${endpoint}. Please try again later`,
        });
      }
    } else {
      const res = await fetch(`/api/update${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });
      if (action == "Deny") {
        if (res.ok) {
          const notify = {
            name: result.name,
            reason: reason,
            text: `a ${item} of yours was denied for a ${reason} violation`,
            ref: result._id,
            date: new Date().toUTCString(),
            viewed: false,
          };

          const res1 = await fetch("/api/createNotification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notify),
          });

          if (res1.ok) {
            if (mutate) {
              mutate();
            }

            handleClose();
            setSnackbar({
              open: true,
              severity: "success",
              message: `${endpoint} denied successfully`,
            });
          }
          if (!res1.ok) {
            setSnackbar({
              open: true,
              severity: "error",
              message: `There was a problem denying ${endpoint}. Please try again later`,
            });
          }
        }
        if (!res.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem denying ${endpoint}. Please try again later`,
          });
        }
      } else {
        if (res.ok) {
          if (mutate) {
            mutate();
          }
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} approved successfully`,
          });
        }
        if (!res.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem approving ${endpoint}. Please try again later`,
          });
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="update"
      aria-describedby="update"
    >
      <DialogTitle
        id="update"
        className={className}
        color="textPrimary"
        align="center"
      >
        {action}
      </DialogTitle>
      {action == "Approve" ? (
        <DialogContent className={className}>
          <DialogContentText id="update" color="textPrimary">
            Are you sure you want to approve {endpoint}?
          </DialogContentText>
        </DialogContent>
      ) : (
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
      )}

      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color="secondary"
          variant="outlined"
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Resolve;
