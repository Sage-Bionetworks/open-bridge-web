import {default as ExperiencesMobile1} from '@assets/static/experiences_mobile1.png'
import {default as ExperiencesMobile2} from '@assets/static/experiences_mobile2.png'
import {default as ExperiencesWeb1} from '@assets/static/experiences_web1.png'
import {ReactElement} from 'react'

export type TabInfo = {
  title: string
  body: ReactElement
  image: string
}

export const mobileTabInfo: TabInfo[] = [
  {
    title: 'Activity Home Screen',
    body: (
      <>
        <p>
          Activity schedule is automatically updated for each participant,
          including due dates to help keep them on track.
        </p>
      </>
    ),
    image: ExperiencesMobile1,
  },
  {
    title: 'De-identified login',
    body: (
      <>
        <p>
          Participants login with a unique identifier known only to Study
          Coordinators. No other uniquely identifying information is collected.
        </p>
      </>
    ),
    image: ExperiencesMobile2,
  },
  {
    title: 'History of Activities',
    body: (
      <>
        <p>Participants can see the activities they have completed.</p>
      </>
    ),
    image: ExperiencesMobile1,
  },
  {
    title: 'Opt-in settings for notifications and background data monitoring',
    body: (
      <>
        <p>
          Participants can control their reminders and background data
          collection settings
        </p>
      </>
    ),
    image: ExperiencesMobile2,
  },
  {
    title: 'Study contact information and Participants Rights',
    body: (
      <>
        <p>
          Study and IRB information is transparently available for participants
          to understand their rights.
        </p>
      </>
    ),
    image: ExperiencesMobile2,
  },
  {
    title: 'Privacy Dashboard',
    body: (
      <>
        <p>
          Privacy practices are explicitly and clearly stated in a simple
          dashboard
        </p>
      </>
    ),
    image: ExperiencesMobile2,
  },
]

export const webTabInfo: TabInfo[] = [
  {
    title: 'Assessment Library',
    body: (
      <>
        <p>
          Explore and select from a library of validated assessments with
          transparent scoring data
        </p>
      </>
    ),
    image: ExperiencesWeb1,
  },
  {
    title: 'Study Builder',
    body: (
      <>
        <p>
          Create a study schedule of assessments for your participants to
          follow. Use custom calendar events to trigger assessments
        </p>
      </>
    ),
    image: ExperiencesWeb1,
  },
  {
    title:
      'Preview the entire participant experience in the app for your custom study before you launch.',
    body: (
      <>
        <p></p>
      </>
    ),
    image: ExperiencesWeb1,
  },
  {
    title: 'Participant manager',
    body: (
      <>
        <p>
          Enroll and withdraw participants from your study and manage any custom
          calendar dates
        </p>
      </>
    ),
    image: ExperiencesWeb1,
  },
  {
    title: 'Adherence dashboard - Coming soon!',
    body: (
      <>
        <p>
          Check on adherence and completion activities for individual
          participants
        </p>
      </>
    ),
    image: ExperiencesWeb1,
  },
  {
    title: 'App customization',
    body: (
      <>
        <p>
          Make the Mobile toolbox app your own by adding custom messages, logo,
          and color scheme. Review custom changes in real-time
        </p>
      </>
    ),
    image: ExperiencesWeb1,
  },
  {
    title: 'Background distraction data monitoring',
    body: (
      <>
        <p>
          Allow study participants to opt-in to collecting background
          distraction phone data such as noise, motion, and environment
        </p>
      </>
    ),
    image: ExperiencesWeb1,
  },
]
