import { Box, IconButton, TextField } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React, { FunctionComponent } from 'react'
import participants_icon from '../../assets/participants_icon.svg'
import { ThemeType } from '../../style/theme'
import { Study } from '../../types/types'
import LiveIcon from './LiveIcon'

const DraftIcon = () => {
  return (
    <Box
      width="100%"
      height="4px"
      borderRadius="5px"
      bgcolor="#C4C4C4"
      position="relative"
    >
      <Box
        width="20%"
        height="4px"
        borderRadius="5px 0 0 5px"
        bgcolor="#3E3030"
        position="absolute"
      ></Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    width: '290px',
    height: '184px',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: '0px',
    boxShadow: '0 4px 4px 0 rgb(0 0 0 / 35%)',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: 'bold',
    fontStyle: '12px',
  },
  liveIconContainer: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  cardStatus: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    fontSize: 'small',
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1.25),
  },
  cardTopContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25, 1.25),
    alignItems: 'center',
  },
  lastEditedTest: {
    fontFamily: 'Lato',
    fontSize: '10px',
    fontWeight: 'lighter',
  },
  participantsRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    fontFamily: 'Lato',
    fontSize: '12px',
  },
  participantsIcon: {
    width: '25px',
    height: '25px',
    marginRight: theme.spacing(0.5),
  },
  studyStatusRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    fontFamily: 'Lato',
    fontWeight: 'lighter',
    fontSize: '10px',
  },
  cardBottomContainer: {
    width: '100%',
    padding: theme.spacing(0.5),
  },
  studyNameText: {
    fontFamily: 'Poppins',
    fontSize: '18px',
  },
  studyCardTextField: {
    marginBottom: theme.spacing(2),
  },
  isJustAdded: {
    border: `3px solid ${theme.palette.primary.dark}`,
    animation: '$pop-out 0.5s ease',
  },
  '@keyframes pop-out': {
    '0%': {
      transform: 'scale(0)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}))

const cancelPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
}

const getFormattedDate = (date: Date) => {
  const months = [
    'Jan.',
    'Feb.',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ]
  const year = date.getFullYear()
  let month = months[date.getMonth()]
  let day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return `${month} ${day}, ${year} @ ${getFormattedTime(date)}`
}

const getFormattedTime = (date: Date) => {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const timeOfDay = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12
  const minutesToString = minutes < 10 ? '0' + minutes : minutes
  return `${hours}:${minutesToString}${timeOfDay}`
}

const CardBottom: FunctionComponent<{
  study: Study
}> = ({ study }: { study: Study }) => {
  const classes = useStyles()
  const date = new Date(
    study.status === 'DRAFT' ? study.createdOn! : study.modifiedOn!,
  )

  return (
    <Box
      display="flex"
      textAlign="left"
      paddingTop="8px"
      position="absolute"
      bottom="8px"
      left="8px"
      right="8px"
    >
      <div className={classes.cardBottomContainer}>
        {study.status === 'DRAFT' ? (
          <div className={classes.lastEditedTest}>Last edited:</div>
        ) : (
          <div className={classes.participantsRow}>
            <img
              src={participants_icon}
              className={classes.participantsIcon}
              alt="participant number"
            />
            [56]
          </div>
        )}

        <div className={classes.studyStatusRow}>
          <div>
            {study.status === 'DRAFT'
              ? `[${getFormattedDate(date)}]`
              : `[Launched: ${getFormattedDate(date)}]`}
          </div>
          <div>[Lynn B.]</div>
        </div>
      </div>
    </Box>
  )
}

const CardTop: FunctionComponent<StudyCardProps> = ({
  study,
  onSetAnchor,
}: StudyCardProps) => {
  function getCorrectCardName(status: string): string {
    if (status === 'DRAFT') {
      return 'Draft'
    } else if (status === 'COMPLETED') {
      return 'Closed'
    } else {
      return 'Live'
    }
  }
  const classes = useStyles()

  return (
    <Box
      display="flex"
      textAlign="left"
      paddingTop="8px"
      className={classes.cardTopContainer}
    >
      {study.status !== 'COMPLETED' ? (
        <IconButton
          style={{ padding: '0' }}
          onClick={e => {
            cancelPropagation(e)
            onSetAnchor(e.currentTarget)
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ) : (
        <div />
      )}
      {study.status === 'ACTIVE' ? (
        <div className={classes.liveIconContainer}>
          <LiveIcon />
        </div>
      ) : (
        <div className={classes.cardStatus}>
          {getCorrectCardName(study.status)}
        </div>
      )}
    </Box>
  )
}

type StudyCardProps = {
  study: Study
  onSetAnchor: Function
  isRename?: boolean
  onRename?: Function
}

type NewlyAddedProp = {
  isNewlyAddedStudy?: boolean
}

const StudyCard: FunctionComponent<StudyCardProps & NewlyAddedProp> = ({
  study,
  onSetAnchor,
  isRename,
  onRename,
  isNewlyAddedStudy,
}) => {
  const classes = useStyles()
  const input = React.createRef<HTMLInputElement>()

  const handleKeyDown = (
    event: React.KeyboardEvent,
    name: string | undefined,
  ) => {
    if (!onRename) {
      return
    }
    const { key } = event

    const enterKey = 'Enter'

    if (key === 'Escape') {
      onRename(study.name)
    }
    if (key === 'Tab' || key === enterKey) {
      onRename(name)
    }
  }
  return (
    <>
      <Card
        className={`${classes.root} ${
          isNewlyAddedStudy ? classes.isJustAdded : ''
        }`}
        onClick={e => {
          if (isRename) {
            cancelPropagation(e)
          }
        }}
      >
        <>
          <CardTop study={study} onSetAnchor={onSetAnchor}></CardTop>
        </>
        <CardContent>
          <div>
            {!isRename && (
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.studyNameText}
                gutterBottom={study.status === 'DRAFT' ? true : false}
              >
                {study.name}
              </Typography>
            )}
            {isRename && (
              <TextField
                variant="outlined"
                defaultValue={study.name}
                size="small"
                className={classes.studyCardTextField}
                inputRef={input}
                onBlur={e => onRename && onRename(input.current?.value)}
                onKeyDown={e => handleKeyDown(e, input.current?.value)}
                onClick={e => cancelPropagation(e)}
              />
            )}
          </div>
          {study.status === 'DRAFT' && <DraftIcon />}
          {study.status !== 'DRAFT' && (
            <Typography className={classes.title} color="textSecondary">
              Study ID: {study.identifier}
            </Typography>
          )}
        </CardContent>
        <CardBottom study={study}></CardBottom>
      </Card>
    </>
  )
}

export default StudyCard
