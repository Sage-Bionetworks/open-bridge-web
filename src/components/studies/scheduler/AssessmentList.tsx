import AssessmentSmall from '@components/assessments/AssessmentSmall'
import {Box, FormControlLabel, FormGroup, MenuItem, Select, Typography} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import {PerformanceOrder, StudySession} from '@typedefs/scheduling'
import {Assessment} from '@typedefs/types'
import React from 'react'

export interface AssessmentListProps {
  studySession: StudySession
  performanceOrder: PerformanceOrder
  onChangePerformanceOrder: (p: PerformanceOrder) => void
  isReadOnly?: boolean
}

type AssessmentDisplayType = {
  assessment: Assessment
  translateY: number
  assessmentIndex: number
  realIndex: number
}

const AssessmentList: React.FunctionComponent<AssessmentListProps> = ({
  studySession,
  performanceOrder,
  onChangePerformanceOrder,

  isReadOnly,
}: AssessmentListProps): JSX.Element => {
  const [assessmentsToDisplay, setAssessentsToDisplay] = React.useState<AssessmentDisplayType[]>([])

  React.useEffect(() => {
    if (!studySession.assessments) {
      setAssessentsToDisplay([])
      return
    }
    let assessments = studySession.assessments.map((assessment, index) => {
      return {
        assessment: assessment,
        translateY: 0,
        assessmentIndex: index,
        realIndex: index,
      } as AssessmentDisplayType
    })
    if (performanceOrder === 'randomized') {
      const shuffledAssesments = shuffle([...assessments])
      for (const assessmentInfo of assessments) {
        const newIndex = shuffledAssesments.findIndex(el => el.assessmentIndex === assessmentInfo.assessmentIndex)
        const indexChanged = newIndex - assessmentInfo.assessmentIndex
        assessmentInfo.translateY = indexChanged * 96 + indexChanged * 8
        assessmentInfo.realIndex = newIndex
      }
    }
    setAssessentsToDisplay(assessments)
  }, [performanceOrder])

  // Code taken from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const shuffle = (array: AssessmentDisplayType[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  const performanceOrderList = [
    {value: 'participant_choice', label: 'Participant Choice'},
    {value: 'sequential', label: 'Fixed Order'},
    //{value: 'randomized', label: 'Randomized Order'},
  ]

  const assessmentOrderElement = !isReadOnly ? (
    <Select
      fullWidth
      variant="outlined"
      onChange={e => {
        onChangePerformanceOrder(e.target.value as PerformanceOrder)
      }}
      value={performanceOrder}>
      {performanceOrderList.map((el, index) => (
        <MenuItem /*className={classes.optionClass}*/ key={index} value={el.value} id={`investigator-${index}`}>
          {el.label}
        </MenuItem>
      ))}
    </Select>
  ) : (
    <Box fontSize="14px" fontFamily={latoFont}>
      {performanceOrderList.find(el => el.value === performanceOrder)?.label || ''}
    </Box>
  )

  return (
    <Box>
      {studySession.assessments && studySession.assessments.length > 1 && (
        <FormGroup aria-label="assessments" sx={{marginBottom: theme.spacing(2), width: '100%'}}>
          <FormControlLabel
            labelPlacement="top"
            sx={{
              width: '100%',

              marginLeft: theme.spacing(0),
              marginTop: theme.spacing(1.5),
            }}
            control={assessmentOrderElement}
            label={
              <Typography variant="h4" sx={{textSlign: 'left', width: '100%', marginBottom: theme.spacing(1)}}>
                Assessment Order:
              </Typography>
            }
          />
        </FormGroup>
      )}

      {studySession.assessments &&
        assessmentsToDisplay.map((assessmentInfo, index) => (
          <Box
            key={studySession.guid! + assessmentInfo.assessment.guid + index}
            style={{
              opacity:
                performanceOrder !== 'participant_choice' && assessmentInfo.realIndex !== 0 && !isReadOnly ? 0.3 : 1,
              transform: `translateY(${assessmentInfo.translateY}px)`,
              transitionDuration: '0.4s',
            }}>
            <AssessmentSmall
              isHideDuration={false}
              assessment={assessmentInfo.assessment}
              hasHover={false}
              isDragging={false}></AssessmentSmall>
          </Box>
        ))}
    </Box>
  )
}

export default AssessmentList
