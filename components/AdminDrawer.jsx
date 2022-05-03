import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

const drawerWidth = 120;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  paper: {
    width: drawerWidth,
    zIndex: 0,
  },
  container: {
    overflow: "auto",
  },
}));

const AdminDrawer = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.paper,
      }}
    >
      <Toolbar />
      <div className={classes.container}>
        <List>
          <ListItem button key="home" onClick={() => router.push("/admin")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            key="people"
            onClick={() => router.push("/admin/people")}
          >
            <ListItemText primary="People" />
          </ListItem>
          <ListItem
            button
            key="posts"
            onClick={() => router.push("/admin/posts")}
          >
            <ListItemText primary="Posts" />
          </ListItem>
          <ListItem
            button
            key="comments"
            onClick={() => router.push("/admin/comments")}
          >
            <ListItemText primary="Comments" />
          </ListItem>
          <ListItem
            button
            key="flags"
            onClick={() => router.push("/admin/flags")}
          >
            <ListItemText primary="Flags" />
          </ListItem>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default AdminDrawer;
