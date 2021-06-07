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

export const SECTIONS: { name: string; path: StudySection }[] = [
  // { name: 'Set up Study', path: 'description' },
  { name: 'Create Sessions', path: 'session-creator' },
  { name: 'Schedule Sessions', path: 'scheduler' },
  { name: 'Enrollment Type', path: 'enrollment-type-selector' },
  { name: 'Customize App', path: 'customize' },
  // { name: 'Designate Groups', path: 'team-settings' },

  { name: 'Optional Monitoring', path: 'passive-features' },
  { name: 'Preview Study', path: 'preview' },
  // { name: 'IRB Approval', path: 'irb' },
  // { name: 'Review Alerts', path: 'alerts' },
  { name: 'Launch Study', path: 'launch' },
]

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
