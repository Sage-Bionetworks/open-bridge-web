import {useUserSessionDataState} from '@helpers/AuthContext'
import {ARC_APP_ID, INV_ARC_ID, MTB_APP_ID, OPEN_BRIDGE_APP_ID} from './constants'

type SourceAppConfig = {
  longName: string
  shortName: string
}

export const sourceAppConfig: Record<string, SourceAppConfig> = {
  [MTB_APP_ID]: {
    longName: 'Mobile Toolbox',
    shortName: 'MTB',
  },
  [OPEN_BRIDGE_APP_ID]: {
    longName: 'Open Bridge',
    shortName: 'Open Bridge',
  },
  [ARC_APP_ID]: {
    longName: 'ARC',
    shortName: 'ARC',
  },
  [INV_ARC_ID]: {
    longName: 'ARC',
    shortName: 'ARC',
  },
}

// TODO (Hallie Swan, Sep 22, 2023): use this hook to remove hard-coded app text
// https://sagebionetworks.jira.com/browse/DHP-1011
export const useSourceApp = () => {
  const sessionData = useUserSessionDataState()
  const appId = sessionData.appId
  return {...sourceAppConfig[appId], appId: appId}
}
