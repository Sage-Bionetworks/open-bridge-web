import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Box, FormControl, Paper} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, theme} from '@style/theme'
import {ScheduleNotification} from '@typedefs/scheduling'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import NotificationInterval from './NotificationInterval'
import {StyledSmallSectionHeader} from './SharedComponents'

const useStyles = makeStyles(theme => ({
  root: {
    //  backgroundColor: '#ECF1F4',
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
  /* multilineBodyText: {
    backgroundColor: theme.palette.common.white,
    '& textarea': {
      backgroundColor: theme.palette.common.white,
    },
  },*/
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
  canDelete?: boolean
}

const NotificationWindow: React.FunctionComponent<NotificationWindowProps> = ({
  notification,
  onChange,
  onDelete,
  index,
  isMultiday,
  children,
  isError,
  canDelete,
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
    <Paper className={clsx(classes.root, isError && classes.error)} elevation={2}>
      <StyledSmallSectionHeader
        onClick={() => onDelete()}
        title={`${index + 1}. ${index === 0 ? 'Initial Notification' : 'Follow-up Notification'}`}
        canDelete={canDelete}
      />

      <Box mx="auto" width="auto" sx={{padding: theme.spacing(3, 3, 0, 3)}}>
        <FormControl fullWidth sx={{marginBottom: theme.spacing(1)}}>
          <SimpleTextLabel htmlFor={`subject-line-${index}`}>Subject line: (30 character limit)</SimpleTextLabel>
          <SimpleTextInput
            id={`subject-line-${index}`}
            variant="outlined"
            multiline={false}
            fullWidth={true}
            defaultValue={_.first(notification.messages)?.subject || ''}
            onBlur={e => updateMessage({subject: e.target.value})}
            inputProps={{
              maxLength: 30,
            }}></SimpleTextInput>
        </FormControl>

        <FormControl fullWidth sx={{marginBottom: theme.spacing(1)}}>
          <SimpleTextLabel htmlFor={`body-text-${index}`}>Body text: (40 character limit)</SimpleTextLabel>
          <SimpleTextInput
            id={`body-text-${index}`}
            multiline={true}
            fullWidth={true}
            variant="outlined"
            rows="3"
            defaultValue={_.first(notification.messages)?.message || ''}
            onBlur={e => updateMessage({message: e.target.value})}
            inputProps={{
              maxLength: 40,
            }}></SimpleTextInput>
        </FormControl>

        {children}

        {index > 0 && isMultiday && (
          <NotificationInterval
            repeatInterval={notification.interval}
            onChange={e =>
              onChange({
                ...notification,
                interval: e,
              })
            }></NotificationInterval>
        )}
      </Box>
    </Paper>
  )
}

export default NotificationWindow
