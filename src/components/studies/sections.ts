export type StudySection =
  | 'scheduler'
  | 'session-creator'
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
  { name: 'Set up Study', path: 'description' },
  { name: 'Design App', path: 'branding' },

  { name: 'Create Sessions', path: 'session-creator' },
  { name: 'Schedule Sessions', path: 'scheduler' },
  { name: 'Designate Groups', path: 'team-settings' },

  { name: 'Passive Features', path: 'passive-features' },
  { name: 'Preview App', path: 'preview' },
  { name: 'IRB Approval', path: 'irb' },
  { name: 'Review Alerts', path: 'alerts' },
  { name: 'Launch Study', path: 'launch' },
]
