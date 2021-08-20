
// UPDATE
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';

import React from 'react';
// import Navigation from './Navigation';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      zIndex: 0,
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(4),
      backgroundColor: '#eee',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(4),
      backgroundColor: 'white',
      maxWidth: 1280,
      margin: 'auto',
    },
  })
);

const EditorLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  

  return (
    <>
      
      <div className={classes.root}>
       
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <div className={classes.content}>{children}</div>
        </main>
      </div>
    </>
  );
};

export default EditorLayout;