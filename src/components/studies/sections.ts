import CreateSessionHoveredIcon from '../../assets/study-builder-icons/hovered/create_sessions_hover_icon.svg'
import CustomizeAppHoveredIcon from '../../assets/study-builder-icons/hovered/customize_app_hover_icon.svg'
import EnrollmentTypeHoveredIcon from '../../assets/study-builder-icons/hovered/enrollment_type_hover_icon.svg'
import LaunchStudyHoveredIcon from '../../assets/study-builder-icons/hovered/launch_study_hover_icon.svg'
import PreviewStudyHoveredIcon from '../../assets/study-builder-icons/hovered/preview_study_hover_icon.svg'
import RecordersHoveredIcon from '../../assets/study-builder-icons/hovered/recorders_hover_icon.svg'
import ScheduleSessionsHoveredIcon from '../../assets/study-builder-icons/hovered/schedule_sessions_hover_icon.svg'
import CreateSessionRegularIcon from '../../assets/study-builder-icons/normal/create_sessions_normal_icon.svg'
import CustomizeAppRegularIcon from '../../assets/study-builder-icons/normal/customize_app_normal_icon.svg'
import EnrollmentTypeRegularIcon from '../../assets/study-builder-icons/normal/enrollment_type_normal_icon.svg'
import LaunchStudyRegularIcon from '../../assets/study-builder-icons/normal/launch_study_normal_icon.svg'
import PreviewStudyRegaularIcon from '../../assets/study-builder-icons/normal/preview_study_normal_icon.svg'
import RecordersRegularIcon from '../../assets/study-builder-icons/normal/recorders_normal_icon.svg'
import ScheduleSessionsRegularIcon from '../../assets/study-builder-icons/normal/schedule_sessions_normal_icon.svg'
import Utility from '../../helpers/utility'
import CONSTANTS from '../../types/constants'
export type StudySection =
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
  liveName?: string
  path: StudySection
  hideApps?: string[]
  isEditableLive?: boolean
  isHiddenLive?: boolean
}[] = [
  {name: 'Create Sessions', path: 'session-creator'},
  {name: 'Schedule Sessions', path: 'scheduler'},
  {name: 'Enrollment Type', path: 'enrollment-type-selector'},
  {name: 'Customize App', path: 'customize', isEditableLive: true},

  {
    name: 'Optional Monitoring',
    path: 'passive-features',
    hideApps: [CONSTANTS.constants.ARC_APP_ID],
  },
  {name: 'Preview Study', path: 'preview', isHiddenLive: true},

  {
    name: 'Launch Study',
    liveName: 'Study & IRB Details',
    path: 'launch',
    isEditableLive: true,
  },
]

const appId = Utility.getAppId()

export const getStudyBuilderSections = (isStudyInDraft: boolean) => {
  return isStudyInDraft
    ? SECTIONS.filter(section => !section.hideApps?.includes(appId))
    : SECTIONS.filter(
        section => !section.hideApps?.includes(appId) && !section.isHiddenLive
      )
}

export const isSectionEditableWhenLive = (
  sectionPath: StudySection
): boolean | undefined => {
  const section = SECTIONS.find(section => section.path === sectionPath)
  if (!section) {
    throw Error(`the ${sectionPath} section is not exist`)
  } else {
    return section.isEditableLive
  }
}

export const normalNavIcons = [
  CreateSessionRegularIcon,
  ScheduleSessionsRegularIcon,
  EnrollmentTypeRegularIcon,
  CustomizeAppRegularIcon,
  RecordersRegularIcon,
  PreviewStudyRegaularIcon,
  LaunchStudyRegularIcon,
]
export const hoverNavIcons = [
  CreateSessionHoveredIcon,
  ScheduleSessionsHoveredIcon,
  EnrollmentTypeHoveredIcon,
  CustomizeAppHoveredIcon,
  RecordersHoveredIcon,
  PreviewStudyHoveredIcon,
  LaunchStudyHoveredIcon,
]
