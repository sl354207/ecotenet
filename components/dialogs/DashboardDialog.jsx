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

const DashboardDialog = ({
  open,
  handleClose,
  contentType,
  action,
  className,
  result,
  setSnackbar,
  mutate,
}) => {
  const router = useRouter();
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
        status: "published",
        approved: "pending",
        updated: true,
        featured: result.featured,
        date: new Date().toUTCString(),
        feature: "false",
      };
      break;
    case "comment":
      endpoint = "Comment";
      item = "comment";
      submission = {
        _id: result._id,
        date: new Date().toUTCString(),
        text: result.text,
        approved: "pending",
        updated: true,
      };
      break;
    case "draft":
      endpoint = "Post";
      item = "draft";
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
        status: action == "Publish" ? "published" : "draft",
        approved: action == "Publish" ? "pending" : "false",
        updated: false,
        featured: false,
        date: action == "Publish" ? new Date().toUTCString() : "",
        feature: "false",
      };
      break;
    case "create":
      endpoint = "Post";
      item = "draft";
      submission = {
        title: result.title,
        name: "Muskrat",
        description: result.description,
        category: result.category,
        tags: result.tags,
        ecoregions: result.ecoregions,
        id: result.id,
        version: result.version,
        rows: result.rows,
        status: action == "Publish" ? "published" : "draft",
        approved: action == "Publish" ? "pending" : "false",
        updated: false,
        featured: false,
        date: action == "Publish" ? new Date().toUTCString() : "",
        feature: "false",
      };
      break;
    default:
      break;
  }

  // const [reason, setReason] = useState("language");

  // const handleChange = (event) => {
  //   setReason(event.target.value);
  // };

  const handleSubmit = async () => {
    switch (action) {
      case "Save":
        const res = await fetch(
          contentType == "create"
            ? `/api/create${endpoint}`
            : `/api/update${endpoint}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
          }
        );
        if (!res.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem saving ${endpoint}. Please try again later`,
          });
        }

        if (res.ok && contentType == "create") {
          const ID = await res.json();
          router.push(`/dashboard/drafts/${ID.insertedId}`);
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} saved successfully`,
          });
        } else {
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} saved successfully`,
          });
        }

        break;
      case "Publish":
        const res2 = await fetch(
          contentType == "create"
            ? `/api/create${endpoint}`
            : `/api/update${endpoint}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
          }
        );
        if (!res2.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem publishing ${endpoint}. Please try again later`,
          });
        }

        if (res2.ok && contentType == "create") {
          const ID = await res.json();
          router.push(`/dashboard/posts/${ID.insertedId}`);
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} published successfully`,
          });
        } else {
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} published successfully`,
          });
        }
        break;
      case "Delete":
        const res3 = await fetch(`/api/delete${endpoint}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result._id),
        });

        if (res3.ok) {
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
        if (!res3.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem deleting ${endpoint}. Please try again later`,
          });
        }

        break;

      default:
        break;
    }
    // if (action == "Delete") {
    //   const res = await fetch(`/api/delete${endpoint}`, {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body:
    //       contentType == "person"
    //         ? JSON.stringify(result.name)
    //         : JSON.stringify(result._id),
    //   });

    //   if (res.ok && contentType !== "person") {
    //     const notify = {
    //       name: result.name,
    //       reason: reason,
    //       text: `a ${item} of yours was deleted for a ${reason} violation`,
    //       ref: result._id,
    //       date: new Date().toUTCString(),
    //       viewed: false,
    //     };

    //     const res1 = await fetch("/api/createNotification", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(notify),
    //     });

    //     if (res1.ok) {
    //       if (mutate) {
    //         mutate();
    //       }

    //       handleClose();
    //       setSnackbar({
    //         open: true,
    //         severity: "success",
    //         message: `${endpoint} deleted successfully`,
    //       });
    //     }
    //     if (!res1.ok) {
    //       setSnackbar({
    //         open: true,
    //         severity: "error",
    //         message: `There was a problem deleting ${endpoint}. Please try again later`,
    //       });
    //     }
    //   }
    //   if (!res.ok) {
    //     setSnackbar({
    //       open: true,
    //       severity: "error",
    //       message: `There was a problem deleting ${endpoint}. Please try again later`,
    //     });
    //   }
    // } else {
    //   const res = await fetch(`/api/update${endpoint}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(submission),
    //   });
    //   if (action == "Deny") {
    //     if (res.ok) {
    //       const notify = {
    //         name: result.name,
    //         reason: reason,
    //         text: `a ${item} of yours was denied for a ${reason} violation`,
    //         ref: result._id,
    //         date: new Date().toUTCString(),
    //         viewed: false,
    //       };

    //       const res1 = await fetch("/api/createNotification", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(notify),
    //       });

    //       if (res1.ok) {
    //         if (mutate) {
    //           mutate();
    //         }

    //         handleClose();
    //         setSnackbar({
    //           open: true,
    //           severity: "success",
    //           message: `${endpoint} denied successfully`,
    //         });
    //       }
    //       if (!res1.ok) {
    //         setSnackbar({
    //           open: true,
    //           severity: "error",
    //           message: `There was a problem denying ${endpoint}. Please try again later`,
    //         });
    //       }
    //     }
    //     if (!res.ok) {
    //       setSnackbar({
    //         open: true,
    //         severity: "error",
    //         message: `There was a problem denying ${endpoint}. Please try again later`,
    //       });
    //     }
    //   } else {
    //     if (res.ok) {
    //       if (mutate) {
    //         mutate();
    //       }
    //       handleClose();
    //       setSnackbar({
    //         open: true,
    //         severity: "success",
    //         message: `${endpoint} approved successfully`,
    //       });
    //     }
    //     if (!res.ok) {
    //       setSnackbar({
    //         open: true,
    //         severity: "error",
    //         message: `There was a problem approving ${endpoint}. Please try again later`,
    //       });
    //     }
    //   }
    // }
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

      <DialogContent className={className}>
        <DialogContentText id="update" color="textPrimary">
          Are you sure you want to {action} {endpoint}?
        </DialogContentText>
      </DialogContent>

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

export default DashboardDialog;
