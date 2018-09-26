import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {compose} from 'redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Trigger from './Trigger'
import styles from './styles'

class Modal extends React.Component {
  componentDidMount = () => {
    console.log('Modal mount')
  }

  componentWillUnmount = () => {
    console.log('Modal unmount')
  }

  render () {
    const {classes, children, trigger} = this.props

    return (
      <Trigger trigger={trigger}>

        <Card className={classes.card}>

          <CardContent>
            {children}
          </CardContent>

        </Card>

      </Trigger>
    )
  }
}

const enhance = compose(
  withStyles(styles)
)

export default enhance(Modal) // eslint-disable-line
