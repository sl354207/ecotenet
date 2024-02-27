export const handleOpenDialog = (user, signIn, router, setDialog) => {
  if (user.status === "unauthenticated" || user.status === "loading") {
    signIn();
  }
  if (user.status === "authenticated") {
    if (user.name === null || user.name === "" || user.name === undefined) {
      router.push("/auth/new-user");
    } else {
      setDialog(true);
    }
  }
};
export const handleOpenPostDialog = (
  action,
  result,
  user,
  signIn,
  router,
  setItem,
  setAction,
  setDialog,
  setCommentForm
) => {
  if (user.status === "unauthenticated" || user.status === "loading") {
    signIn();
  }
  if (user.status === "authenticated") {
    if (user.name === null || user.name === "" || user.name === undefined) {
      router.push("/auth/new-user");
    } else {
      setItem(result);
      setAction(action);
      setDialog(true);
      if (action === "Comment") {
        setCommentForm({ type: "open", payload: result.comment_ref });
      }
    }
  }
};

export const handleOpenPostFlag = (
  action,
  result,
  user,
  signIn,
  router,
  setItem,
  setAction,
  setFlag
) => {
  if (user.status === "unauthenticated" || user.status === "loading") {
    signIn();
  }
  if (user.status === "authenticated") {
    if (user.name === null || user.name === "" || user.name === undefined) {
      router.push("/auth/new-user");
    } else {
      setItem(result);
      setAction(action);
      setFlag(true);
    }
  }
};

export const handleOpenAdminDialog = (
  action,
  type,
  result,
  setItem,
  setAction,
  setDialog
) => {
  setItem(result);
  setAction({ action: action, type: type });

  setDialog(true);
};

export const handleOpenResolve = (
  name,
  ID,
  setDialog,
  setAction,
  setResolve
) => {
  if (name && ID) {
    setDialog(true);
    setAction({ name: name, ID: ID });
  } else {
    setResolve(true);
  }
};

export const handleCloseDialog = (setDialog) => {
  setDialog(false);
};

export const handleClosePostDialog = (reply, setDialog, setCommentForm) => {
  setDialog(false);

  if (reply === "reply") {
    setCommentForm({ type: "all", payload: "" });
  }
  if (reply && reply !== "reply" && reply !== "") {
    setCommentForm({ type: "open", payload: reply });
  }
};

export const handleClosePostFlag = (setFlag) => {
  setFlag(false);
};
