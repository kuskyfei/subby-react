import {createAction} from 'redux-actions'
import A from './type'

const setSettings = createAction(A.SET_SETTINGS)

export default {
  setSettings
}
