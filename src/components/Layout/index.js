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
  link: <div className="card__white-border-3px"><blockquote className="reddit-card"><a href="https://www.reddit.com/r/mildlyinteresting/comments/9b3f7r/in_canada_because_certain_dyes_are_banned_orange/"></a></blockquote></div>
}

const instagram = {
  comment: 'This is my other comment!',
  link: <div className="card__white-border-1px"><blockquote style={{width: "100%"}} className="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/Bm_wQfVBu1w/?utm_source=ig_embed"></blockquote></div>
}

const youtube = {
  comment: 'Awesome!',
  link: <div className='embed-container'><iframe src='https://www.youtube.com/embed/mjs3_Kkn05w' frameborder='0' allowfullscreen></iframe></div>
}

const vimeo = {
  comment: 'YEEEEEEE',
  link: <div className='embed-container'><iframe src='https://player.vimeo.com/video/257056050' frameborder='0' allowfullscreen></iframe></div>
}

const facebook = {
  comment: 'cool',
  link: <div className='card__white-border-1px'><div className='embed-container'><iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fafterafterparty%2Fvideos%2F2258644881026208%2F" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media" allowFullScreen="true"></iframe></div></div>
}

const twitter = {
  comment: 'cool',
  link: <div className='card__white-border-1px'><blockquote class="twitter-tweet" data-lang="en"><a href="https://twitter.com/ethereum/status/1035526464135942145?ref_src=twsrc%5Etfw"></a></blockquote></div>
}

class Checkout extends React.Component {

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

          {/*
          <Card post={reddit}/>
          <Card post={instagram}/>
          <Card post={youtube}/>
          <Card post={vimeo}/>
          <Card post={facebook}/>
          */}
          <Card post={twitter}/>

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

Checkout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);
