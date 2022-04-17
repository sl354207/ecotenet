import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const SurePeopleAdmin = ({
  open,
  handleClose,
  person,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  setSnackbar,
  mutate,
}) => {
  const router = useRouter();

  // function to delete post by id
  const deletePerson = async (name) => {
    const res = await fetch("/api/deletePerson", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    });
    handleClose();
    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Account deleted successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem deleting account. Please try again later",
      });
    }
  };

  // ADD ERROR SNACKBAR
  const handleSubmit = async (person, action) => {
    //combine all objects and send to api
    const submission = {
      _id: person._id,
      name: person.name,
      bio: person.bio,
      email: person.email,
      website: person.website,
      socials: person.socials,
      flags: person.flags,
      denials: action == "Deny" ? person.denials + 1 : person.denials,
      approved: action == "Approve" ? "true" : "false",
    };

    const res = await fetch("/api/updatePerson", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });
    handleClose();

    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Account updated successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem updating account. Please try again later",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabeledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogContent className={className}>
        <DialogContentText id={id} color="textPrimary">
          {sure} {action}?
        </DialogContentText>
      </DialogContent>
      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={
            action == "Approve" || action == "Deny"
              ? () => handleSubmit(person, action)
              : () => deletePerson(person.name)
          }
          color="secondary"
          variant="outlined"
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SurePeopleAdmin;
