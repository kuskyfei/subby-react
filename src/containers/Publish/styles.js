const styles = theme => ({
  card: {
    width: '75vw',
    maxWidth: theme.spacing.unit * 62,
    [theme.breakpoints.down(600 + theme.spacing.unit * 2 * 2)]: {
      width: '90vw'
    },
    boxShadow: '0 2px 3px 0 rgba(60,64,67,0.3),0 6px 10px 4px rgba(60,64,67,0.15)!important',
    background: theme.palette.background.default,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      transform: 'scale(1.2)'
    }
  },

  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  publishButton: {
    marginLeft: 'auto',
    minWidth: 120,
    minHeight: 40
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },

  upload: {
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2 + 3,
    marginBottom: theme.spacing.unit * 3,
    minHeight: theme.spacing.unit * 14,
    '&:focus': {
      outline: 'none'
    },
    caretColor: 'transparent'
  },
  uploadNotDragging: {
    border: `5px ${theme.palette.grey['300']} dashed`,
    color: theme.palette.grey['400']
  },
  uploadDragging: {
    color: theme.palette.text.secondary,
    border: `5px ${theme.palette.text.secondary} dashed`
  },

  greyIcon: {
    color: theme.palette.grey['300'],
    fontSize: 36
  },

  publishButtonLoading: {
    display: 'inline-block',
    minWidth: 24,
    transform: 'translateY(2px)'
  },
  black: {
    color: 'rgba(0, 0, 0, 0.87)!important'
  },

  textField: {
    '& div': {
      background: theme.palette.background.paper,
      borderRadius: 5,
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      minHeight: theme.spacing.unit * 12
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
      margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    '& textarea::placeholder': {
      color: theme.palette.text.hint
    }
  },

  errorMessage: {
    paddingRight: 8,
    paddingLeft: 8,
    [theme.breakpoints.down(450)]: {
      '& p': {
        fontSize: 12
      }
    },
    '& a': {
      fontWeight: 600
    },
    '& strong': {
      fontWeight: 600
    },
    '& p': {
      color: 'rgb(255, 0, 0)'
    },
  },
  address: {
    wordBreak: 'break-all'
  }

})

export default styles
