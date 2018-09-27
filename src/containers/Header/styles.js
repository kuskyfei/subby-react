const styles = images => theme => {
  const debug = require('debug')('theme')
  debug(theme)

  return {
    logo: {
      height: 55,
      minWidth: 70,
      backgroundImage: `url(${images.logo})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: 'center'
    },

    publishButton: {
      margin: theme.spacing.unit
    },
    publishButtonText: {
      [theme.breakpoints.down(1050)]: {
        display: 'none'
      }
    },
    rightIcon: {
      [theme.breakpoints.up(1050)]: {
        marginLeft: theme.spacing.unit
      }
    },

    searchBar: {
      margin: theme.spacing.unit,
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 2,
      paddingTop: 2,
      paddingBottom: 1,
      color: 'white',
      background: 'rgba(255, 255, 255, 0.15)',
      maxWidth: 600,
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.25)'
      }
    },
    searchIcon: {
      marginLeft: 20,
      marginRight: 20,
      [theme.breakpoints.down(500)]: {
        marginLeft: 10,
        marginRight: 10
      }
    },
    searchInput: {
      color: 'white',
      marginRight: 20,
      [theme.breakpoints.down(500)]: {
        marginRight: 10
      }
    },

    loadingIcon: {
      minWidth: 20,
      transform: 'translateY(-2px)',
      marginRight: 20,
      [theme.breakpoints.down(500)]: {
        marginRight: 11
      }
    },

    middleContainer: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      width: 600
    },
    rightContainer: {
      flex: 1,
      whiteSpace: 'nowrap',
      textAlign: 'right'
    },
    leftContainer: {
      flex: 1,
      [theme.breakpoints.down(600 + theme.spacing.unit * 2 * 2)]: {
        display: 'none'
      }
    }
  }
}

export default styles
