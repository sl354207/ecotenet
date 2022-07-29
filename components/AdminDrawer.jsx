import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/router";

const drawerWidth = 120;

const AdminDrawer = () => {
  const router = useRouter();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 0,
      }}
    >
      <Toolbar />
      <div style={{ overflow: "auto" }}>
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
