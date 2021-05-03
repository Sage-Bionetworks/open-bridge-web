import { Box, createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Schedule } from '../../../types/scheduling'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

type TimelineSession = {
  guid: string
  label: string
  minutesToComplete: number
}

type TimelineScheduleItem = {
  instanceGuid: 'JYvaSpcTPot8TwZnFFFcLQ'
  startDay: number
  endDay: number
  startTime: string
  delayTime: string
  expiration: string
  refGuid: string
  assessments?:any[] 
}

export interface TimelinePlotProps {
  timeline: any
  schedule: Schedule

}

const TimelinePlot: React.FunctionComponent<TimelinePlotProps> = ({
  timeline,
  schedule: schedFromDisplay,
}: TimelinePlotProps) => {
  const [sessions, setSessions] = React.useState<TimelineSession[]>([])
  const [schedule, setSchedule] = React.useState<TimelineScheduleItem[]>()
  React.useEffect(() => {
    debugger
    if (timeline?.sessions) {
      const { sessions, schedule } = timeline
      setSessions(sessions)
      setSchedule(schedule)
    }
  }, [timeline])

  const getSession = (sessionGuid: string): TimelineSession => {
    return sessions.find(s => s.guid === sessionGuid)!
  }

  const getTimesForSession = (sessionGuid: string): TimelineScheduleItem[] => {
    return schedule?.filter(i => i.refGuid === sessionGuid)?.map(i=> {delete i.assessments;   return i})|| []
  }

  return (
    <Box border="1px solid black" padding="30px" bgcolor="#ECECEC">
      This timeline viewer will update to provide a visual summary of the
      schedules you’ve defined below for each session.
 
      {/*schedFromDisplay?.sessions?.map((s, index) => (
        <>
          <SessionIcon index={index}>
            {getSession(s.guid!)?.label + '---' + s.guid}
          </SessionIcon>
          <ObjectDebug
            data={getTimesForSession(s.guid!)}
            label=""
          ></ObjectDebug>
        </>
      ))*/}
    </Box>
  )
}

export default TimelinePlot
