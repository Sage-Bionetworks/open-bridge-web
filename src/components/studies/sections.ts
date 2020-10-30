export type StudySection =
  | 'scheduler'
  | 'session-creator'
  | 'description'
  | 'team-settings'
  | 'timeline-viewer'
  | 'passive-features'

export const SECTIONS: { name: string; path: StudySection }[] = [
  { name: '01. Study Description', path: 'description' },

  { name: '02. Team Settings', path: 'team-settings' },
  { name: '03. Sessions Creator', path: 'session-creator' },
  { name: '04. Scheduler', path: 'scheduler' },
  { name: '05. Timeline Viewer', path: 'timeline-viewer' },
  { name: '06. Passive Features', path: 'passive-features' },
  /* { name: '07. Branding Element ', path: 'branding' },
    { name: '08. Preview App', path: 'preview' },
    { name: '09. Payment ', path: 'payments' },
    { name: '10. IRB Approval', path: 'irb' },
    { name: '11. Alerts', path: 'alerts' },
    { name: '12. Launch Study', path: 'launch' },*/
]
