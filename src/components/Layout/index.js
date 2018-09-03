/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Card from '../Card'

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
  }
});

const reddit = {
  comment: 'hey this is my comment',
  link: "https://www.reddit.com/r/mildlyinteresting/comments/9b3f7r/in_canada_because_certain_dyes_are_banned_orange/",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const instagram = {
  comment: 'This is my other comment!',
  link: "https://www.instagram.com/p/Bm_wQfVBu1w/",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const youtube = {
  comment: 'Awesome!',
  link: 'https://www.youtube.com/watch?v=EMiYqvGzvkI',
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const vimeo = {
  comment: 'YEEEEEEE',
  link: 'https://vimeo.com/video/257056050',
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const facebook = {
  comment: 'cool',
  link: "https://www.facebook.com/thementionlive/videos/vb.608219979558854/867753370088312/?type=2&theater",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const twitter = {
  comment: 'cool',
  link: "https://twitter.com/ethereum/status/1035526464135942145?ref_src=twsrc%5Etfw",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const image = {
  comment: 'cool',
  link: "https://i.redditmedia.com/KvKXQkAuBvZOaNAwh7bJbE4WnQELy94-7UmUR6VgPqU.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=960&s=825840bdf4581af9f7d9aca36a3d29f6",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

class Layout extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>

        <CssBaseline />

        <AppBar position="absolute" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Subby
            </Typography>
          </Toolbar>
        </AppBar>

        <main className={classes.layout}>
          
          <Card post={image}/>

          {/* 
          <Card post={youtube}/>
          <Card post={vimeo}/>
          <Card post={twitter}/>
          <Card post={facebook}/>
          <Card post={reddit}/>
          <Card post={instagram}/>
          */}

        </main>

        <footer className={classes.footer}>
          <Typography variant="title" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subheading" align="center" color="textSecondary" component="p">
            Something here to give the footer a purpose!
          </Typography>
        </footer>

      </React.Fragment>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Layout);