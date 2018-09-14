import {createAction} from 'redux-actions'
import A from './type'

const setSettingsToInitialState = createAction(A.SET_SETTINGS_TO_INITIAL_STATE)
const setSettings = createAction(A.SET_SETTINGS)

export default {
  setSettingsToInitialState,
  setSettings
}
