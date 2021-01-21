import {
  Button,
  createStyles,
  FormControlLabel,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { poppinsFont } from '../../../style/theme'
import { HDWMEnum, StartEventId } from '../../../types/scheduling'
import Duration from './Duration'
import StudyStartDate from './StudyStartDate'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),

      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
    },
  }),
)

export interface IntroInfoProps {
  onContinue: Function
}

const IntroInfo: React.FunctionComponent<IntroInfoProps> = ({
  onContinue,
}: IntroInfoProps) => {
  const classes = useStyles()
  const [duration, setDuration] = React.useState<any>('')
  const [startEventId, setstartEventId] = React.useState<
    StartEventId | undefined
  >(undefined)

  return (
    <>
      <FormControlLabel
        classes={{ label: classes.labelDuration }}
        label="Study Duration"
        style={{ fontSize: '16px' }}
        labelPlacement="start"
        control={
          <Duration
            onChange={e => setDuration(e)}
            durationString={duration || ''}
            unitLabel="study duration unit"
            numberLabel="study duration number"
            unitData={HDWMEnum}
          ></Duration>
        }
      />

      <StudyStartDate
        isIntro={true}
        onChange={(pseudonym: StartEventId) =>
          setstartEventId(pseudonym)
        }
      />

      <Button
        variant="contained"
        onClick={e => onContinue(duration, startEventId)}
        disabled={!(duration && startEventId)}
      >
        Continue
      </Button>
    </>
  )
}

export default IntroInfo
