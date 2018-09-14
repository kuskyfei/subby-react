// react
import React from 'react'
import PropTypes from 'prop-types'

// material
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 4,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      paddingTop: theme.spacing.unit * 6,
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  title: {
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit * 6
    },
    [theme.breakpoints.down(400 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '3rem'
    }
  },
  grid: {
    [theme.breakpoints.down(500 + theme.spacing.unit * 2 * 2)]: {
      display: 'block!important',
      '& > div': {
        maxWidth: '100%'
      }
    },
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit * 6
    }
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
    }
  },
  links: {
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit * 6
    },
    '& a:hover': {
      textDecoration: 'underline'
    }
  }
})

class About extends React.Component {
  componentDidMount () {

  }

  render () {
    const {classes} = this.props

    return (
      <div className={classes.layout}>

        <Typography className={classes.title} variant='display3' gutterBottom>
          An uncensorable platform for content creators.
        </Typography>

        <Grid className={classes.grid} container spacing={24}>

          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant='title' gutterBottom>
                Step 1
              </Typography>
              <Typography variant='body1' gutterBottom>
                A content creator publishes a piece of content online (e.g. Youtube, Torrent, etc.)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant='title' gutterBottom>
                Step 2
              </Typography>
              <Typography variant='body1' gutterBottom>
                They broadcast a link to this content on the Ethereum network for a small fee (approx. 2c worth of gas.)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant='title' gutterBottom>
                Step 3
              </Typography>
              <Typography variant='body1' gutterBottom>
                Their thousands of subscribers get it on their newsfeed directly from the Ethereum network, at no cost.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <div className={classes.links}>
          <Typography variant='display1' gutterBottom>
            <a href='https://subby.io/follow' target='_blank'>Find accounts to follow</a>
          </Typography>

          <Typography variant='display1' gutterBottom>
            <a href='https://subby.io/publish' target='_blank'>Start publishing content</a>
          </Typography>

          <Typography variant='display1' gutterBottom>
            <a href='https://subby.io/github' target='_blank'>Look at the code</a>
          </Typography>
        </div>

      </div>
    )
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(About) // eslint-disable-line
