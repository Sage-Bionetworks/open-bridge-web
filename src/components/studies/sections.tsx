import Utility from '../../helpers/utility'

import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone'
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone'
import MicTwoToneIcon from '@mui/icons-material/MicTwoTone'
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone'
import PermDeviceInformationTwoToneIcon from '@mui/icons-material/PermDeviceInformationTwoTone'
import SettingsInputCompositeTwoToneIcon from '@mui/icons-material/SettingsInputCompositeTwoTone'
import SmartphoneTwoToneIcon from '@mui/icons-material/SmartphoneTwoTone'
import TouchAppTwoToneIcon from '@mui/icons-material/TouchAppTwoTone'
//import PermDeviceInformationTwoToneIcon from '@mui/icons-material/PermDeviceInformationTwoTone';
import React from 'react'

export type StudySection =
  | 'study-details'
  | 'scheduler'
  | 'session-creator'
  | 'enrollment-type-selector'
  | 'description'
  | 'team-settings'
  | 'timeline-viewer'
  | 'passive-features'
  | 'customize'
  | 'irb'
  | 'preview'
  | 'alerts'
  | 'launch'

const SECTIONS: {
  name: string
  path: StudySection
  navIcon: React.ReactElement
  hoverIcon?: string
  hideApps?: string[]
  isEditableLive?: boolean
  isHiddenLive?: boolean
  isHiddenDraft?: boolean
  buttonName?: string
  hiddenByDefault?: boolean
  showApps?: string[]   // list of apps to show when hidden by default
}[] = [
  {
    name: 'Study Details',
    path: 'study-details',
    navIcon: <PermDeviceInformationTwoToneIcon />,
  },
  {
    name: 'Create Sessions',
    path: 'session-creator',
    navIcon: <CategoryTwoToneIcon />,
  },
  {
    name: 'Schedule Sessions',
    path: 'scheduler',
    navIcon: <DateRangeTwoToneIcon />,
  },
  {
    name: 'Enrollment Type',
    path: 'enrollment-type-selector',
    navIcon: <PeopleAltTwoToneIcon />,
  },
  {
    name: 'Customize App',
    path: 'customize',
    isEditableLive: true,
    navIcon: <SettingsInputCompositeTwoToneIcon />,
  },

  {
    name: 'Optional Monitoring',
    path: 'passive-features',
    navIcon: <MicTwoToneIcon />,
    hiddenByDefault: true,
    showApps: [],   
  },
  {
    name: 'Preview Study',
    path: 'preview',
    isHiddenLive: true,
    navIcon: <SmartphoneTwoToneIcon />,
  },

  {
    name: 'Launch Study',
    buttonName: 'Prepare to Launch Study',
    path: 'launch',
    isHiddenLive: true,
    navIcon: <TouchAppTwoToneIcon />,
  },
  {
    name: 'Study & IRB Details',

    path: 'launch',
    isHiddenDraft: true,
    isEditableLive: true,
    navIcon: <TouchAppTwoToneIcon />,
  },
]

const appId = Utility.getAppId()

export const getStudyBuilderSections = (isStudyInDraft: boolean) => {
  return SECTIONS.filter(section => 
    !section.hideApps?.includes(appId) && 
    (isStudyInDraft ? !section.isHiddenDraft : !section.isHiddenLive) && 
    (!section.hiddenByDefault || section.showApps?.includes(appId)))
}

export const isSectionEditableWhenLive = (sectionPath: StudySection): boolean | undefined => {
  const sections = SECTIONS.filter(section => section.path === sectionPath)
  if (!sections.length) {
    throw Error(`isSectionEditableWhenLive: the ${sectionPath} section does not exist`)
  } else {
    const hasEditableSections = sections.find(section => section.isEditableLive === true)
    return !!hasEditableSections
  }
}
