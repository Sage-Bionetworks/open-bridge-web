import {
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import React, {FunctionComponent} from 'react'
import {poppinsFont} from '../../../style/theme'
import {Schedule} from '../../../types/scheduling'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import SessionIcon from '../../widgets/SessionIcon'
import SmallTextBox from '../../widgets/SmallTextBox'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(13, 7, 3, 7),
      textAlign: 'left',
    },
    burstBox: {
      display: 'flex',
      padding: theme.spacing(3, 0),
      border: '1px solid black',
      margin: theme.spacing(8, 3),

      '& > div': {
        flex: '1 1 0px',
        textAlign: 'center',
        padding: theme.spacing(0, 8),
        '&:first-child': {
          textAlign: 'left',
          borderRight: '1px solid black',
        },
      },
    },
    checked: {
      color: '#FFF509',
      '& .MuiSvgIcon-root': {
        fill: '#FFF509',
        backgroundColor: 'black',
      },
    },
    burstSchedule: {
      alignItems: 'flex-end',
      padding: theme.spacing(5, 0, 0, 5),
      marginBottom: theme.spacing(15),

      '& .MuiFormControl-root': {
        flexDirection: 'row',
        marginBottom: theme.spacing(1),
        fontFamily: poppinsFont,
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'flex-end',
        '& label': {
          lineHeight: '21px',
          fontFamily: poppinsFont,
          fontSize: '14px',
          position: 'static',
          transform: 'none',
          maxWidth: '100px',
          textAlign: 'left',
          marginRight: theme.spacing(2),
        },
        '& .MuiTextField-root': {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
        },
      },
    },
  })
)

type ConfigureBurstTabProps = {
  schedule: Schedule
  onUpdate: Function
  onSave: Function
  // hasObjectChanged: boolean
  //saveLoader: boolean
}

const ConfigureBurstTab: FunctionComponent<ConfigureBurstTabProps> = ({
  //hasObjectChanged,
  //saveLoader,
  onUpdate,
  schedule,
  onSave,
}: ConfigureBurstTabProps) => {
  const classes = useStyles()

  const [hasBursts, setHasBursts] = React.useState(false)
  const [burstSessionGuids, setBurstSessionGuids] = React.useState<string[]>([])
  const [burstNumber, setBurstNumber] = React.useState<number | undefined>()
  const [burstFrequency, setBurstFrequency] =
    React.useState<number | undefined>()

  //setting new state
  const updateData = (schedule: Schedule) => {
    // setSchedule(schedule)
    onUpdate(schedule)
  }

  return (
    <div className={classes.root}>
      <MTBHeadingH1>Multiple scheduling of the same events</MTBHeadingH1>
      <p>
        Ecological Momentary Assessment (EMA) provides a way to repeatedly
        sample participant over time to better capture their ehaviors and
        experiences in real time, also referred to as Study Bursts.
      </p>
      <p>
        Example: Participants will take a session of 4 assessments everyday for
        a week. They redo this burst every 3 months for the next two years.
      </p>

      <MTBHeadingH2>Will your study include an EMA/Study Burst? </MTBHeadingH2>

      <ToggleButtonGroup
        value={hasBursts}
        exclusive
        onChange={(e: React.MouseEvent<HTMLElement>, val: boolean) =>
          setHasBursts(val)
        }
        aria-label="study includes bursts">
        <ToggleButton value={false} aria-label="no">
          No
        </ToggleButton>
        <ToggleButton value={true} aria-label="yes">
          Yes
        </ToggleButton>
      </ToggleButtonGroup>

      {hasBursts && (
        <div className={classes.burstBox}>
          <div>
            What scheduled session(s) in your study should be repeated as a
            burst?
            <FormGroup style={{alignItems: 'left'}}>
              {schedule.sessions.map((s, index) => (
                <FormControlLabel
                  key={s.guid}
                  control={
                    <Checkbox
                      color="secondary"
                      classes={{checked: classes.checked}}
                      checked={burstSessionGuids.includes(s.guid!)}
                      onChange={e => {
                        e.target.checked
                          ? setBurstSessionGuids(prev => [...prev, s.guid!])
                          : setBurstSessionGuids(prev =>
                              prev.filter(guid => guid !== s.guid)
                            )
                      }}
                      name="isburst"
                    />
                  }
                  label={
                    <SessionIcon index={index} key={s.guid}>
                      {s.name}
                    </SessionIcon>
                  }></FormControlLabel>
              ))}
            </FormGroup>
          </div>
          <div>
            How often should this burst be scheduled to repeat?
            <FormGroup className={classes.burstSchedule}>
              <FormControl fullWidth>
                <InputLabel htmlFor="burst-freq">
                  Assign a new <br />
                  burst every:
                </InputLabel>
                <SmallTextBox
                  value={burstFrequency}
                  isLessThanOneAllowed={false}
                  onChange={e => setBurstFrequency(Number(e.target.value))}
                />
                weeks
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="burst-num">For:</InputLabel>
                <SmallTextBox
                  isLessThanOneAllowed={false}
                  value={burstNumber}
                  onChange={e => setBurstNumber(Number(e.target.value))}
                />
                bursts
              </FormControl>
            </FormGroup>
            <SaveButton style={{margin: '0 auto 16px auto'}} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigureBurstTab
