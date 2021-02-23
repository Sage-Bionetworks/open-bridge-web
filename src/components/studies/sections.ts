export type StudySection =
  | 'scheduler'
  | 'session-creator'
  | 'enrollment-type-selector'
  | 'description'
  | 'team-settings'
  | 'timeline-viewer'
  | 'passive-features'
  | 'branding'
  | 'irb'
  | 'preview'
  | 'alerts'
  | 'launch'

export const SECTIONS: { name: string; path: StudySection }[] = [
  // { name: 'Set up Study', path: 'description' },
  { name: 'Customize App', path: 'branding' },

  { name: 'Create Sessions', path: 'session-creator' },
  { name: 'Schedule Sessions', path: 'scheduler' },
  { name: 'Enrollment Type', path: 'enrollment-type-selector' },
  // { name: 'Designate Groups', path: 'team-settings' },

  { name: 'Passive Features', path: 'passive-features' },
  { name: 'Preview Study', path: 'preview' },
  // { name: 'IRB Approval', path: 'irb' },
  // { name: 'Review Alerts', path: 'alerts' },
  { name: 'Launch Study', path: 'launch' },
]
