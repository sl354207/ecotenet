import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import theme from "@utils/theme";
import { useRouter } from "next/router";

const drawerWidth = 150;

// create custom primary component
const Primary = ({ text, number }) => {
  return (
    <div style={{ display: "flex" }}>
      {text}
      <>
        {number !== 0 && (
          <div
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: theme.palette.error.main,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              marginLeft: "5px",
              marginTop: "1px",
            }}
          >
            {" "}
            {number}
          </div>
        )}
      </>
    </div>
  );
};

const AdminDrawer = ({ home, pending }) => {
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
            href="/admin/people"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText
              primary={
                home ? (
                  <>
                    {pending && (
                      <Primary text="People" number={pending.people} />
                    )}
                  </>
                ) : (
                  "People"
                )
              }
            />
          </ListItemButton>
          <ListItemButton
            key="posts"
            href="/admin/posts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText
              primary={
                home ? (
                  <>
                    {pending && <Primary text="Posts" number={pending.posts} />}
                  </>
                ) : (
                  "Posts"
                )
              }
            />
          </ListItemButton>
          <ListItemButton
            key="comments"
            href="/admin/comments"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText
              primary={
                home ? (
                  <>
                    {pending && (
                      <Primary text="Comments" number={pending.comments} />
                    )}
                  </>
                ) : (
                  "Comments"
                )
              }
            />
          </ListItemButton>
          <ListItemButton
            key="flags"
            href="/admin/flags"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText
              primary={
                home ? (
                  <>
                    {pending && <Primary text="Flags" number={pending.flags} />}
                  </>
                ) : (
                  "Flags"
                )
              }
            />
          </ListItemButton>
          <ListItemButton
            key="notifications"
            href="/admin/notifications"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText
              primary={
                home ? (
                  <>
                    {pending && (
                      <Primary
                        text="Notifications"
                        number={pending.notifications}
                      />
                    )}
                  </>
                ) : (
                  "Notifications"
                )
              }
            />
          </ListItemButton>
          <ListItemButton key="species" href="/admin/species">
            <ListItemText primary="Species" />
          </ListItemButton>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default AdminDrawer;
