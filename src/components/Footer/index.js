import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {Github, Reddit, Medium, Twitter} from '../images'

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
    '& a:hover': {
      color: 'rgba(0, 0, 0, 0.35)'
    }
  },
  section: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30
  },
  p: {
    color: 'rgba(0, 0, 0, 0.25)'
  },
  icons: {
    '& svg': {
      paddingLeft: 5,
      paddingRight: 5
    }
  }
})

class Footer extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <footer className={classes.footer}>

        <div className={classes.section}>
          <Typography className={classes.p} align='center' component='p'>
            Subby is a decentralized application that protects content creators against censorship and <a href='https://en.wikipedia.org/wiki/Algorithmic_bias' target='_blank'>algorithmic bias</a>. All content is hosted on <a href='https://en.wikipedia.org/wiki/Ethereum' target='_blank'>Ethereum</a>, <a href='https://en.wikipedia.org/wiki/InterPlanetary_File_System'>IPFS</a>, and <a href='https://en.wikipedia.org/wiki/BitTorrent' target='_blank'>torrents</a>.
          </Typography>
        </div>

        <Typography className={classes.icons} align='center' component='p'>

          <a className='footer__icon-link' href='https://subby.io/github' target='_blank'>
            <Github color='#00000020' size='50' />
          </a>
          <a className='footer__icon-link' href='https://subby.io/reddit' target='_blank'>
            <Reddit color='#00000020' size='50' />
          </a>
          <a className='footer__icon-link' href='https://subby.io/twitter' target='_blank'>
            <Twitter color='#00000020' size='50' />
          </a>
          <a className='footer__icon-link' href='https://subby.io/medium' target='_blank'>
            <Medium color='#00000020' size='50' />
          </a>

        </Typography>

      </footer>
    )
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Footer)
