import {
  Divider,
  Drawer,
  List,
  ListItemButton,
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
          <ListItemButton key="home" onClick={() => router.push("/admin")}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton
            key="people"
            // onClick={() => router.push("/admin/people")}
            href="/admin/people"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="People" />
          </ListItemButton>
          <ListItemButton
            key="posts"
            // onClick={() => router.push("/admin/posts")}
            href="/admin/posts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="Posts" />
          </ListItemButton>
          <ListItemButton
            key="comments"
            // onClick={() => router.push("/admin/comments")}
            href="/admin/comments"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="Comments" />
          </ListItemButton>
          <ListItemButton
            key="flags"
            // onClick={() => router.push("/admin/flags")}
            href="/admin/flags"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="Flags" />
          </ListItemButton>
          <ListItemButton
            key="notifications"
            // onClick={() => router.push("/admin/notifications")}
            href="/admin/notifications"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="Notifications" />
          </ListItemButton>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default AdminDrawer;
