import {
  Box,
  IconButton,
  makeStyles,
  Paper,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import clsx from 'clsx'
import React from 'react'
import {
  AssessmentWindow as AssessmentWindowType,
  HDWMEnum,
} from '../../../types/scheduling'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'
import {getDropdownTimeItems} from './utility'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#ECF1F4',
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  windowNumber: {
    backgroundColor: theme.palette.primary.dark,
    height: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(6),
    color: '#000',
  },
  smallLabel: {
    minWidth: '200px',
    maxWidth: '300px',
    '& span': {
      display: 'block',
      fontSize: '12px',
    },
  },
  redBorder: {
    border: `1px solid ${theme.palette.error.main}`,
  },
}))

export interface AssessmentWindowProps {
  window: AssessmentWindowType
  index: number
  onChange: (w: AssessmentWindowType) => void
  onDelete: Function
  errorText: string
}

const AssessmentWindow: React.FunctionComponent<AssessmentWindowProps> = ({
  window,
  onChange,
  onDelete,
  index,
  errorText,
}: AssessmentWindowProps) => {
  const classes = useStyles()
  return (
    <Paper
      className={clsx(classes.root, errorText && classes.redBorder)}
      elevation={2}>
      <Box position="relative">
        <Box className={classes.windowNumber}>{index + 1}.</Box>
        <IconButton
          style={{position: 'absolute', top: '12px', right: '16px'}}
          edge="end"
          size="small"
          onClick={() => onDelete()}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </Box>
      <Box mx="auto" width="auto">
        <SchedulingFormSection
          label={'Start'}
          variant="small"
          border={false}
          style={{margin: '24px 0px 0px 0', paddingBottom: 0}}>
          <SelectWithEnum
            value={window.startTime}
            style={{marginLeft: 0}}
            sourceData={getDropdownTimeItems()}
            id="from"
            onChange={e =>
              onChange({
                ...window,
                startTime: e.target.value as string,
              })
            }></SelectWithEnum>
        </SchedulingFormSection>

        <SchedulingFormSection
          label={'Expire after'}
          variant="small"
          border={false}
          style={{margin: '0px 0px 16px 0px', paddingBottom: 0}}>
          <Box display="inline-flex" alignItems="center">
            <Duration
              onChange={e =>
                onChange({
                  ...window,
                  expiration: e.target.value as string,
                })
              }
              durationString={window.expiration || ''}
              unitDefault={HDWMEnum.H}
              unitLabel="Expire after"
              numberLabel="expiration"
              unitData={HDWMEnum}></Duration>
          </Box>
        </SchedulingFormSection>
      </Box>
    </Paper>
  )
}

export default AssessmentWindow
