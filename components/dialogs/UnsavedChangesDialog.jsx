import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const UnsavedChangesDialog = ({ shouldConfirmLeave }) => {
  const [shouldShowLeaveConfirmDialog, setShouldShowLeaveConfirmDialog] =
    useState(false);
  const [nextRouterPath, setNextRouterPath] = useState();

  const Router = useRouter();

  const onRouteChangeStart = useCallback(
    (nextPath) => {
      if (!shouldConfirmLeave) {
        return;
      }

      setShouldShowLeaveConfirmDialog(true);
      setNextRouterPath(nextPath);

      throw "cancelRouteChange";
    },
    [shouldConfirmLeave]
  );

  const onRejectRouteChange = () => {
    setNextRouterPath(null);
    setShouldShowLeaveConfirmDialog(false);
  };

  const onConfirmRouteChange = () => {
    setShouldShowLeaveConfirmDialog(false);
    // simply remove the listener here so that it doesn't get triggered when we push the new route.
    // This assumes that the component will be removed anyway as the route changes
    removeListener();
    Router.push(nextRouterPath);
  };

  const removeListener = () => {
    Router.events.off("routeChangeStart", onRouteChangeStart);
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", onRouteChangeStart);

    return removeListener;
  }, [onRouteChangeStart]);

  return (
    <Dialog
      // title="You have unsaved changes"
      // description="Leaving this page will discard unsaved changes. Are you sure?"
      // confirmLabel="Discard changes"
      // cancelLabel="Go back"
      open={shouldShowLeaveConfirmDialog}
      // onConfirm={onConfirmRouteChange}
      // onReject={onRejectRouteChange}
    >
      {/* <DialogTitle id="client-dialog-title" color="textPrimary" align="center">
        {contentType}
      </DialogTitle> */}

      <DialogContent>
        <DialogContentText id="client-dialog-text" color="textPrimary">
          You have unsaved changes. Are you sure you want to leave?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => onRejectRouteChange()}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirmRouteChange()}
          color="secondary"
          variant="outlined"
        >
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesDialog;
