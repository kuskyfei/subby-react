const styles = theme => ({
  card: {
    width: '75vw',
    maxWidth: theme.spacing.unit * 62,
    [theme.breakpoints.down(450)]: {
      width: '100vw',
      height: '100vh',
      overflow: 'auto'
    },
    boxShadow: '0 2px 3px 0 rgba(60,64,67,0.3),0 6px 10px 4px rgba(60,64,67,0.15)!important',
    background: theme.palette.background.default,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      transform: 'scale(1.2)'
    }
  }
})

export default styles
