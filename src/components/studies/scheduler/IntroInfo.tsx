import {
  Button,
  createStyles,
  FormControlLabel,
  Theme,
  Divider,
  Container,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { poppinsFont } from '../../../style/theme'
import { DWsEnum, StartEventId } from '../../../types/scheduling'
import Duration from './Duration'
import StudyStartDate from './StudyStartDate'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),

      fontFamily: poppinsFont,
      fontSize: '18px',
      fontWeight: 600,
      marginRight: theme.spacing(9.25),
      marginLeft: theme.spacing(-2),
      textAlign: 'left',
      width: '190px',
    },
    container: {
      backgroundColor: '#FAFAFA',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: theme.spacing(3.75),
      minWidth: '400px',
    },
    formControl: {
      fontSize: '18px',
      width: '90%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    divider: {
      width: '90%',
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(3.75),
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
    <Container maxWidth="sm" className={classes.container}>
      <FormControlLabel
        classes={{ label: classes.labelDuration }}
        label="How long will the study run for?"
        className={classes.formControl}
        labelPlacement="start"
        control={
          <Duration
            onChange={e => setDuration(e.target.value)}
            durationString={duration || ''}
            unitLabel="study duration unit"
            numberLabel="study duration number"
            unitData={DWsEnum}
            isIntro={true}
          ></Duration>
        }
      />
      <Divider className={classes.divider}></Divider>

      <StudyStartDate
        isIntro={true}
        onChange={(pseudonym: StartEventId) => setstartEventId(pseudonym)}
        style={{
          width: '90%',
        }}
      />
      <Button
        variant="contained"
        color="primary"
        key="saveButton"
        onClick={e => onContinue(duration, startEventId)}
        disabled={!(duration && startEventId)}
        style={{ marginTop: '50px' }}
      >
        Continue
      </Button>
    </Container>
  )
}

export default IntroInfo
