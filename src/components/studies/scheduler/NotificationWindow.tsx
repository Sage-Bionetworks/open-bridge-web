import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import {ReactComponent as BellIcon} from '../../../assets/bell.svg'
import {latoFont} from '../../../style/theme'
import {ScheduleNotification} from '../../../types/scheduling'
import NotificationInterval from './NotificationInterval'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#ECF1F4',
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  windowTitle: {
    backgroundColor: theme.palette.primary.dark,
    height: theme.spacing(6),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2, 2, 2, 2),
    fontFamily: latoFont,
    fontWeight: 700,
    fontSize: '16px',

    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    // width: theme.spacing(6),
    color: '#000',
    position: 'relative',
  },
  smallLabel: {
    minWidth: '200px',
    maxWidth: '300px',
    '& span': {
      display: 'block',
      fontSize: '12px',
    },
  },
  multilineBodyText: {
    backgroundColor: theme.palette.common.white,
    '& textarea': {
      backgroundColor: theme.palette.common.white,
    },
  },
  divider: {
    margin: theme.spacing(0, 4, 3, 16),
    backgroundColor: '#BBC3CD',
  },
  error: {
    border: `1px solid ${theme.palette.error.main}`,
  },
}))

export interface NotificationWindowProps {
  isMultiday?: boolean
  index: number
  onChange: (w: ScheduleNotification) => void
  onDelete: Function
  notification: ScheduleNotification
  children: React.ReactNode
  isError: boolean
}

const NotificationWindow: React.FunctionComponent<NotificationWindowProps> = ({
  notification,
  onChange,
  onDelete,
  index,
  isMultiday,
  children,
  isError,
}: NotificationWindowProps) => {
  const updateMessage = (options: {subject?: string; message?: string}) => {
    const messages = notification.messages || []
    // ALINA we only have one message right now
    let message = messages[0] || {lang: 'en', subject: '', message: ''}
    message = {...message, ...options}
    onChange({
      ...notification,
      messages: [message],
    })
  }
  const classes = useStyles()
  return (
    <Paper
      className={clsx(classes.root, isError && classes.error)}
      elevation={2}>
      <Box position="relative">
        <Box className={classes.windowTitle}>
          <BellIcon style={{marginRight: '16px'}} />
          {`${index + 1}. ${
            index === 0 ? 'Initial Notification' : 'Follow-up Notification'
          }`}
        </Box>
        {index > 0 && (
          <IconButton
            style={{position: 'absolute', top: '12px', right: '16px'}}
            edge="end"
            size="small"
            onClick={() => onDelete()}>
            <DeleteIcon></DeleteIcon>
          </IconButton>
        )}
      </Box>
      <Box mx="auto" width="auto">
        <SchedulingFormSection
          label={'Subject line:'}
          variant="small"
          border={false}>
          <TextField
            color="secondary"
            multiline={false}
            fullWidth={true}
            variant="outlined"
            defaultValue={_.first(notification.messages)?.subject || ''}
            onBlur={e => updateMessage({subject: e.target.value})}
            inputProps={{
              maxLength: 40,
            }}></TextField>
        </SchedulingFormSection>

        <SchedulingFormSection
          label={'Body text (40 character limit)'}
          variant="small"
          border={false}>
          <TextField
            color="secondary"
            multiline={true}
            fullWidth={true}
            variant="outlined"
            rows="3"
            classes={{root: classes.multilineBodyText}}
            defaultValue={_.first(notification.messages)?.message || ''}
            onBlur={e => updateMessage({message: e.target.value})}
            inputProps={{
              maxLength: 40,
            }}></TextField>
        </SchedulingFormSection>
        <Divider className={classes.divider} />

        {children}

        {index > 0 && isMultiday && (
          <>
            <Divider className={classes.divider} />
            <NotificationInterval
              repeatInterval={notification.interval}
              onChange={e =>
                onChange({
                  ...notification,
                  interval: e,
                })
              }></NotificationInterval>
          </>
        )}
      </Box>
    </Paper>
  )
}

export default NotificationWindow
