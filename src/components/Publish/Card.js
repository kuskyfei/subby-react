import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  card: {
    width: '75vw',
    maxWidth: theme.spacing.unit * 62,
    [theme.breakpoints.down(600 + theme.spacing.unit * 2 * 2)]: {
      width: '90vw',
    },
    boxShadow: '0 2px 3px 0 rgba(60,64,67,0.3),0 6px 10px 4px rgba(60,64,67,0.15)!important',
    background: theme.palette.background.default,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 3,
    transform: 'scale(1.2)'
  },

  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  publishButton: {
    marginLeft: 'auto'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },

  upload: {
    '& svg': {
      fontSize: 60,
    },
    border: `5px ${theme.palette.grey['300']} dashed`,
    borderRadius: 5,
    color: theme.palette.grey['400'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& h2': {
      padding: theme.spacing.unit * 2,
      fontSize: 30,
      transform: 'translateY(-2px)'
    },
    marginBottom: theme.spacing.unit * 3,
    minHeight: theme.spacing.unit * 14,
  },
  greyIcon: {
    color: theme.palette.grey['300'],
    '&:hover': {
      color: theme.palette.grey['400'],
    },
    fontSize: 36
  },

  textField: {
    '& div': {
      background: theme.palette.background.paper,
      borderRadius: 5,
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      minHeight: theme.spacing.unit * 12,
    },
    '& div:after': {
      display: 'none!important'
    },
    '& div:before': {
      display: 'none!important'
    },
    boxShadow: '0 0 2px 5px #e0e0e012',
    marginBottom: theme.spacing.unit * 3,
    '& textarea': {
      margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    '& textarea::placeholder': {
      color: theme.palette.grey['500']
    },
  },

  helpText: {
    maxWidth: 300
  }

})

class PublishCard extends React.Component {
  state = { expanded: false }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render() {
    const { classes } = this.props

    return (
      <Card className={classes.card}>

        <CardContent>

          <div className={classes.upload}> 
            <Typography variant='title' color='inherit'>
              Drop an image, torrent or paste a link
            </Typography>
          </div>

          <TextField
            className={classes.textField}
            fullWidth
            rows={3}
            multiline
            placeholder={`What?`}
            // value={this.state.password}
            // onChange={this.handleChange('password')}
          />

          <div className={classes.buttonsContainer}> 

            <Tooltip title={<HelpText />} className={classes.helpText} placement="top-start">
              <HelpIcon className={classes.greyIcon} />
            </Tooltip>

            <Button 
              variant='contained' 
              color='default' 
              className={classes.publishButton}
              onClick={this.handleOpen}
            >
              <span className={classes.publishButtonText}>Publish</span>
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>
          </div>
          
        </CardContent>

      </Card>
    )
  }
}

const HelpText = () => 
  <div>
    <p>
      Drop files: jpg, jpeg, png, gif, torrent (e.g. example.jpg)
    </p>
    <p>
      Direct links: jpg, jpeg, png, gif, webm, mp4, ogg, wav, mp3, flac (e.g. https://example.com/something.mp4)
    </p>
    <p>
      Social links: Youtube, Vimeo, Reddit, Twitter, Facebook, Instagram (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)
    </p>
    <p>
      IPFS hashes (e.g. QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo), torrent magnet (e.g. magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df67...)
    </p>
  </div>

PublishCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(PublishCard)