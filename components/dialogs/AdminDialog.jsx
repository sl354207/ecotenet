import { useSnackbarContext } from "@components/context/SnackbarContext";
import TextBox from "@components/inputFields/TextBox";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Portal,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  createNotification,
  deleteComment,
  deletePost,
  deletePostMedia,
  deleteUser,
  deleteUserMedia,
  updateComment,
  updateFlag,
  updatePost,
  updateUser,
} from "@utils/apiHelpers";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const AdminDialog = ({
  open,
  handleClose,
  contentType,
  action,
  result,
  mutate,
  ID,
}) => {
  const { snackbar, setSnackbar } = useSnackbarContext();
  const router = useRouter();

  // used to display proper text in dialog
  let item;

  switch (contentType) {
    case "Post":
      item = "post";

      break;
    case "Comment":
      item = "comment";

      break;
    case "Person":
      item = "profile item";

      break;
    default:
      break;
  }

  const [reason, setReason] = useState("language");

  const [addInfo, setAddInfo] = useState("");

  const [showForm, setShowForm] = useState(false);

  const container = useRef(null);

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleInfoChange = (event) => {
    setAddInfo(event.target.value);
  };

  const handleNotify = async (type, action) => {
    const notify = {
      name: result.name,
      reason: reason,
      text: `a ${type} of yours was ${action} for a ${reason} violation`,
      add_info: addInfo,
      ref: result._id,
    };

    const notifyResponse = await createNotification(notify, "admin");

    return notifyResponse;
  };

  const handleDeletePost = async () => {
    const deletion = {
      _id: result._id,
    };

    const mediaResponse = await deletePostMedia(
      result.name,
      result._id,
      "admin"
    );
    if (mediaResponse.ok) {
      const postResponse = await deletePost(deletion, "admin");

      if (postResponse.ok) {
        const notifyResponse = await handleNotify("post", "deleted");
        if (notifyResponse.ok) {
          if (ID) {
            const flag = {
              id: ID,
              status: "resolved",
            };

            const flagResponse = await updateFlag(flag);
            if (flagResponse.ok) {
              handleClose();
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "success",
                message: `Post deleted successfully`,
              });
              if (router.query.flag) {
                router.push("/admin/flags");
              } else {
                router.push("/admin/posts");
              }
            }
            if (!flagResponse.ok) {
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "error",
                message: `There was a problem resolving flag but post was deleted`,
              });
            }
          } else {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Post deleted successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              router.push("/admin/posts");
            }
          }
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "error",
            message: `There was a problem creating notification but post was deleted`,
          });
        }
      }
      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem deleting post. Please try again later`,
        });
      }
    }
    if (!mediaResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem deleting post. Please try again later`,
      });
    }
  };

  const handleDeleteComment = async () => {
    const deletion = {
      id: result._id,
    };

    const commentResponse = await deleteComment(deletion, "admin");

    if (commentResponse.ok) {
      const notifyResponse = await handleNotify("comment", "deleted");

      if (notifyResponse.ok) {
        if (ID) {
          const flag = {
            id: ID,
            status: "resolved",
          };

          const flagResponse = await updateFlag(flag);
          if (flagResponse.ok) {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Comment deleted successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              mutate("/api/admin/comments");
            }
          }
          if (!flagResponse.ok) {
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "error",
              message: `There was a problem resolving flag but comment was deleted`,
            });
          }
        } else {
          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "success",
            message: `Comment deleted successfully`,
          });
          if (router.query.flag) {
            router.push("/admin/flags");
          } else {
            mutate("/api/admin/comments");
          }
        }
      }
      if (!notifyResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem creating notification but comment was deleted`,
        });
      }
    }
    if (!commentResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem deleting comment. Please try again later`,
      });
    }
  };
  const handleDeletePerson = async () => {
    const deletion = result.name;

    const mediaResponse = await deleteUserMedia(deletion, "admin");

    if (mediaResponse.ok) {
      const userResponse = await deleteUser(deletion, "admin");

      if (userResponse.ok) {
        if (ID) {
          const flag = {
            id: ID,
            status: "resolved",
          };

          const flagResponse = await updateFlag(flag);
          if (flagResponse.ok) {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Account deleted successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              mutate("/api/admin/users");
            }
          }
          if (!flagResponse.ok) {
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "error",
              message: `There was a problem resolving flag but account was deleted`,
            });
          }
        } else {
          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "success",
            message: `Account deleted successfully`,
          });
          if (router.query.flag) {
            router.push("/admin/flags");
          } else {
            mutate("/api/admin/users");
          }
        }
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message:
            "There was a problem deleting account. Please try again later",
        });
      }
    }
    if (!mediaResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: "There was a problem deleting account. Please try again later",
      });
    }
  };

  const handleUpdatePost = async () => {
    const submission = {
      _id: result._id,
      approved: action === "Deny" ? "false" : "true",
      feature: "false",
    };

    const postResponse = await updatePost(submission, "admin");

    if (action === "Deny") {
      if (postResponse.ok) {
        const notifyResponse = await handleNotify("post", "denied");

        if (notifyResponse.ok) {
          if (ID) {
            const flag = {
              id: ID,
              status: "resolved",
            };

            const flagResponse = await updateFlag(flag);
            if (flagResponse.ok) {
              handleClose();
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "success",
                message: `Post denied successfully`,
              });
              if (router.query.flag) {
                router.push("/admin/flags");
              } else {
                router.push("/admin/posts");
              }
            }
            if (!flagResponse.ok) {
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "error",
                message: `There was a problem resolving flag but post was denied`,
              });
            }
          } else {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Post denied successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              router.push("/admin/posts");
            }
          }
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "error",
            message: `There was a problem creating notification but post was denied`,
          });
        }
      }
      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem denying post. Please try again later`,
        });
      }
    } else {
      if (postResponse.ok) {
        if (ID) {
          const flag = {
            id: ID,
            status: "resolved",
          };

          const flagResponse = await updateFlag(flag);
          if (flagResponse.ok) {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Post approved successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              router.push("/admin/posts");
            }
          }
          if (!flagResponse.ok) {
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "error",
              message: `There was a problem resolving flag but post was approved`,
            });
          }
        } else {
          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "success",
            message: `Post approved successfully`,
          });
          if (router.query.flag) {
            router.push("/admin/flags");
          } else {
            router.push("/admin/posts");
          }
        }
      }
      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem approving post. Please try again later`,
        });
      }
    }
  };
  const handleUpdateComment = async () => {
    const submission = {
      id: result._id,
      approved: action === "Deny" ? "false" : "true",
    };

    const commentResponse = await updateComment(submission, "admin");

    if (action === "Deny") {
      if (commentResponse.ok) {
        const notifyResponse = await handleNotify("comment", "denied");

        if (notifyResponse.ok) {
          if (ID) {
            const flag = {
              id: ID,
              status: "resolved",
            };

            const flagResponse = await updateFlag(flag);
            if (flagResponse.ok) {
              handleClose();
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "success",
                message: `Comment denied successfully`,
              });
              if (router.query.flag) {
                router.push("/admin/flags");
              } else {
                mutate("/api/admin/comments");
              }
            }
            if (!flagResponse.ok) {
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "error",
                message: `There was a problem resolving flag but comment was denied`,
              });
            }
          } else {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Comment denied successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              mutate("/api/admin/comments");
            }
          }
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "error",
            message: `There was a problem creating notification but comment was denied`,
          });
        }
      }
      if (!commentResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem denying comment. Please try again later`,
        });
      }
    } else {
      if (commentResponse.ok) {
        if (ID) {
          const flag = {
            id: ID,
            status: "resolved",
          };

          const flagResponse = await updateFlag(flag);
          if (flagResponse.ok) {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Comment approved successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              mutate("/api/admin/comments");
            }
          }
          if (!flagResponse.ok) {
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "error",
              message: `There was a problem resolving flag but comment was approved`,
            });
          }
        } else {
          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "success",
            message: `Comment approved successfully`,
          });
          if (router.query.flag) {
            router.push("/admin/flags");
          } else {
            mutate("/api/admin/comments");
          }
        }
      }
      if (!commentResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem approving comment. Please try again later`,
        });
      }
    }
  };
  const handleUpdatePerson = async () => {
    const submission = {
      name: result.name,
      email: result.email,
      denials: action === "Deny" ? result.denials + 1 : result.denials,
      approved: action === "Approve" ? "true" : "false",
    };

    const userResponse = await updateUser(submission, "admin");

    if (action === "Deny") {
      if (userResponse.ok) {
        const notifyResponse = await handleNotify("profile item", "denied");

        if (notifyResponse.ok) {
          if (ID) {
            const flag = {
              id: ID,
              status: "resolved",
            };

            const flagResponse = await updateFlag(flag);
            if (flagResponse.ok) {
              handleClose();
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "success",
                message: `Profile denied successfully`,
              });
              if (router.query.flag) {
                router.push("/admin/flags");
              } else {
                mutate("/api/admin/users");
              }
            }
            if (!flagResponse.ok) {
              setSnackbar({
                ...snackbar,
                open: true,
                vertical: "bottom",
                horizontal: "left",
                severity: "error",
                message: `There was a problem resolving flag but profile was denied`,
              });
            }
          } else {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Profile denied successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              mutate("/api/admin/users");
            }
          }
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "error",
            message: `There was a problem creating notification but profile was denied`,
          });
        }
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem denying profile. Please try again later`,
        });
      }
    } else {
      if (userResponse.ok) {
        if (ID) {
          const flag = {
            id: ID,
            status: "resolved",
          };

          const flagResponse = await updateFlag(flag);
          if (flagResponse.ok) {
            handleClose();
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "success",
              message: `Profile approved successfully`,
            });
            if (router.query.flag) {
              router.push("/admin/flags");
            } else {
              mutate("/api/admin/users");
            }
          }
          if (!flagResponse.ok) {
            setSnackbar({
              ...snackbar,
              open: true,
              vertical: "bottom",
              horizontal: "left",
              severity: "error",
              message: `There was a problem resolving flag but profile was approved`,
            });
          }
        } else {
          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "success",
            message: `Profile approved successfully`,
          });
          if (router.query.flag) {
            router.push("/admin/flags");
          } else {
            mutate("/api/admin/users");
          }
        }
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem approving profile. Please try again later`,
        });
      }
    }
  };

  const handleUpdateItem = async () => {
    switch (contentType) {
      case "Post":
        await handleUpdatePost();

        break;
      case "Comment":
        await handleUpdateComment();

        break;
      case "Person":
        await handleUpdatePerson();

        break;

      default:
        break;
    }
  };

  const handleDeleteItem = async () => {
    switch (contentType) {
      case "Post":
        await handleDeletePost();

        break;
      case "Comment":
        await handleDeleteComment();

        break;
      case "Person":
        await handleDeletePerson();

        break;

      default:
        break;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      // aria-labelledby="update"
      // aria-describedby="update"
    >
      <DialogTitle id="admin-dialog-title" color="textPrimary" align="center">
        {action}
      </DialogTitle>
      {action === "Approve" ? (
        <DialogContent>
          <DialogContentText id="admin-dialog-text" color="textPrimary">
            Are you sure you want to approve {item}?
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend" color="secondary" focused={true}>
              Reason
            </FormLabel>
            <RadioGroup
              aria-label="reason"
              name="reason"
              value={reason}
              onChange={handleReasonChange}
              row
            >
              <FormControlLabel
                value="language"
                control={
                  <Radio
                    color="secondary"
                    sx={{
                      color: `${theme.palette.secondary.main}!important`,
                    }}
                  />
                }
                label="Language"
              />
              <FormControlLabel
                value="link"
                control={
                  <Radio
                    color="secondary"
                    sx={{
                      color: `${theme.palette.secondary.main}!important`,
                    }}
                  />
                }
                label="Link"
              />
              <FormControlLabel
                value="citation"
                control={
                  <Radio
                    color="secondary"
                    sx={{
                      color: `${theme.palette.secondary.main}!important`,
                    }}
                  />
                }
                label="Citation"
              />
            </RadioGroup>
          </FormControl>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginTop: "25px" }}
            onClick={() => setShowForm(!showForm)}
            endIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            Add Info
          </Button>
          <div style={{ display: "block" }} disablegutters="true">
            {showForm ? (
              <Portal container={container.current}>
                <FormControl sx={{ flexGrow: 1, marginTop: "5px" }}>
                  <InputLabel shrink htmlFor="admin-dialog"></InputLabel>
                  <TextBox
                    id="admin-dialog"
                    handleChange={handleInfoChange}
                    defaultValue=""
                    placeHolder="additional comment on notification"
                    autoFocus={false}
                    name="admin-dialog"
                    inputProps={{ type: "text", maxLength: 200 }}
                  />
                </FormControl>
              </Portal>
            ) : null}

            <div
              ref={container}
              style={{ display: "flex", alignItems: "center" }}
            />
          </div>
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={
            action === "Delete"
              ? () => handleDeleteItem()
              : () => handleUpdateItem()
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

export default AdminDialog;
