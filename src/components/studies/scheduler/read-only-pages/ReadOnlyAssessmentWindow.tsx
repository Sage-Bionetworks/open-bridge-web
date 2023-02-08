import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import React from 'react'

import {getFormattedTimeDateFromPeriodString} from '../utility'
import ReadOnlyWindowTemplate from './ReadOnlyWindowTemplate'
dayjs.extend(customParseFormat)

type ReadOnlyAssessmentWindowProps = {
  index: number
  startTime: string
  expireAfter?: string
}

const ReadOnlyAssessmentWindow: React.FunctionComponent<ReadOnlyAssessmentWindowProps> = ({
  index,
  startTime,
  expireAfter,
}) => {
  const start = dayjs(startTime, 'HH:mm').format('h:mm a')
  return (
    <ReadOnlyWindowTemplate title={`${index}: Session WIndow`} type="SESSION">
      <strong>Start:</strong>
      <br />
      {start}
      <br />
      <br />

      <strong>Expire After:</strong>
      <br />
      {expireAfter}
      {expireAfter ? getFormattedTimeDateFromPeriodString(expireAfter) : 'n/a'}
    </ReadOnlyWindowTemplate>
  )
}

export default ReadOnlyAssessmentWindow
