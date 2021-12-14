import CreateSessionHoveredIcon from '../../assets/study-builder-icons/hovered/create_sessions_hover_icon.svg'
import CustomizeAppHoveredIcon from '../../assets/study-builder-icons/hovered/customize_app_hover_icon.svg'
import EnrollmentTypeHoveredIcon from '../../assets/study-builder-icons/hovered/enrollment_type_hover_icon.svg'
import LaunchStudyHoveredIcon from '../../assets/study-builder-icons/hovered/launch_study_hover_icon.svg'
import LaunchStudyLiveHoveredIcon from '../../assets/study-builder-icons/hovered/launch_study_live_hover_icon.svg'
import PreviewStudyHoveredIcon from '../../assets/study-builder-icons/hovered/preview_study_hover_icon.svg'
import RecordersHoveredIcon from '../../assets/study-builder-icons/hovered/recorders_hover_icon.svg'
import ScheduleSessionsHoveredIcon from '../../assets/study-builder-icons/hovered/schedule_sessions_hover_icon.svg'
import CreateSessionRegularIcon from '../../assets/study-builder-icons/normal/create_sessions_normal_icon.svg'
import CustomizeAppRegularIcon from '../../assets/study-builder-icons/normal/customize_app_normal_icon.svg'
import EnrollmentTypeRegularIcon from '../../assets/study-builder-icons/normal/enrollment_type_normal_icon.svg'
import LaunchStudyLiveRegularIcon from '../../assets/study-builder-icons/normal/launch_study_live_normal_icon.svg'
import LaunchStudyRegularIcon from '../../assets/study-builder-icons/normal/launch_study_normal_icon.svg'
import PreviewStudyRegularIcon from '../../assets/study-builder-icons/normal/preview_study_normal_icon.svg'
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
  path: StudySection
  navIcon: string
  hoverIcon: string
  hideApps?: string[]
  isEditableLive?: boolean
  isHiddenLive?: boolean
  isHiddenDraft?: boolean
  buttonName?: string
}[] = [
  {
    name: 'Create Sessions',
    path: 'session-creator',
    navIcon: CreateSessionRegularIcon,
    hoverIcon: CreateSessionHoveredIcon,
  },
  {
    name: 'Schedule Sessions',
    path: 'scheduler',
    navIcon: ScheduleSessionsRegularIcon,
    hoverIcon: ScheduleSessionsHoveredIcon,
  },
  {
    name: 'Enrollment Type',
    path: 'enrollment-type-selector',
    navIcon: EnrollmentTypeRegularIcon,
    hoverIcon: EnrollmentTypeHoveredIcon,
  },
  {
    name: 'Customize App',
    path: 'customize',
    isEditableLive: true,
    navIcon: CustomizeAppRegularIcon,
    hoverIcon: CustomizeAppHoveredIcon,
  },

  {
    name: 'Optional Monitoring',
    path: 'passive-features',
    hideApps: [CONSTANTS.constants.ARC_APP_ID],
    navIcon: RecordersRegularIcon,
    hoverIcon: RecordersHoveredIcon,
  },
  {
    name: 'Preview Study',
    path: 'preview',
    isHiddenLive: true,
    navIcon: PreviewStudyRegularIcon,
    hoverIcon: PreviewStudyHoveredIcon,
  },

  {
    name: 'Launch Study',
    buttonName: 'Prepare to Launch Study',
    path: 'launch',
    isHiddenLive: true,
    navIcon: LaunchStudyRegularIcon,
    hoverIcon: LaunchStudyHoveredIcon,
  },
  {
    name: 'Study & IRB Details',

    path: 'launch',
    isHiddenDraft: true,
    isEditableLive: true,
    navIcon: LaunchStudyLiveRegularIcon,
    hoverIcon: LaunchStudyLiveHoveredIcon,
  },
]

const appId = Utility.getAppId()

export const getStudyBuilderSections = (isStudyInDraft: boolean) => {
  return isStudyInDraft
    ? SECTIONS.filter(
        section => !section.hideApps?.includes(appId) && !section.isHiddenDraft
      )
    : SECTIONS.filter(
        section => !section.hideApps?.includes(appId) && !section.isHiddenLive
      )
}

export const isSectionEditableWhenLive = (
  sectionPath: StudySection
): boolean | undefined => {
  const sections = SECTIONS.filter(section => section.path === sectionPath)
  if (!sections.length) {
    throw Error(
      `isSectionEditableWhenLive: the ${sectionPath} section does not exist`
    )
  } else {
    const hasEditableSections = sections.find(
      section => section.isEditableLive === true
    )
    return !!hasEditableSections
  }
}
