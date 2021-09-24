import {Box, IconButton, TextField} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import clsx from 'clsx'
import moment from 'moment'
import React, {FunctionComponent} from 'react'
import WithdrawnIcon from '../../assets/cancelled_study_icon.svg'
import CompletedIcon from '../../assets/completed_study_icon.svg'
import LiveIcon from '../../assets/live_study_icon.svg'
import participants_icon from '../../assets/participants_icon.svg'
import {useUserSessionDataState} from '../../helpers/AuthContext'
import Utility from '../../helpers/utility'
import ParticipantService from '../../services/participants.service'
import {ThemeType} from '../../style/theme'
import {Study} from '../../types/types'

const DraftIcon = () => {
  return (
    <Box
      width="100%"
      height="4px"
      borderRadius="5px"
      bgcolor="#C4C4C4"
      position="relative">
      <Box
        width="20%"
        height="4px"
        borderRadius="5px 0 0 5px"
        bgcolor="#3E3030"
        position="absolute"></Box>
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
    boxSizing: 'border-box',

    '&:hover': {
      outline: `4px solid ${theme.palette.primary.dark}`,
    },
  },
  studyId: {
    fontSize: 12,
    fontFamily: 'Lato',
    marginBottom: theme.spacing(2),
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
    alignItems: 'center',
    height: '40px',
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
    animation: '$pop-out 0.5s ease',
    outline: `4px solid ${theme.palette.primary.dark}`,
  },
  '@keyframes pop-out': {
    '0%': {
      transform: 'scale(0)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  menuBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '28px',
    height: '40px',
  },
}))

const cancelPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
}

const getFormattedDate = (date: Date) => {
  return moment(date).format('MMM D, YYYY @ h:mma')
}

const CardBottom: FunctionComponent<{
  study: Study
}> = ({study}: {study: Study}) => {
  const classes = useStyles()
  const [numParticipants, setNumParticipants] = React.useState('--')
  const date = new Date(
    study.phase === 'design' ? study.modifiedOn! : study.createdOn!
  )
  const {token} = useUserSessionDataState()

  React.useEffect(() => {
    //AGENDEL TODO: only for live studies
    const getParticipantCount = async () => {
      const newParticipantNumber =
        await ParticipantService.getNumEnrolledParticipants(
          study.identifier,
          token!
        )
      setNumParticipants('' + newParticipantNumber)
    }
    getParticipantCount()
  }, [token])

  return (
    <Box
      display="flex"
      textAlign="left"
      paddingTop="8px"
      position="absolute"
      bottom="8px"
      left="8px"
      right="8px">
      <div className={classes.cardBottomContainer}>
        {study.phase === 'design' ? (
          <div className={classes.lastEditedTest}>Last edited:</div>
        ) : (
          <div className={classes.participantsRow}>
            <img
              src={participants_icon}
              className={classes.participantsIcon}
              alt="participant number"
            />
            {numParticipants}
          </div>
        )}

        <div className={classes.studyStatusRow}>
          <div>
            {study.phase === 'design'
              ? `${getFormattedDate(date)}`
              : `Launched: ${getFormattedDate(date)}`}
          </div>
        </div>
      </div>
    </Box>
  )
}

const CardTop: FunctionComponent<StudyCardProps> = ({
  study,
  onSetAnchor,
  section,
  isMenuOpen,
}: StudyCardProps) => {
  function getStatusIcon(section: string) {
    if (section === 'LIVE') {
      return LiveIcon
    } else if (section === 'COMPLETED') {
      return CompletedIcon
    } else {
      return WithdrawnIcon
    }
  }
  const classes = useStyles()

  return (
    <Box display="flex" textAlign="left" className={classes.cardTopContainer}>
      <IconButton
        style={{
          padding: '0',
        }}
        onClick={e => {
          cancelPropagation(e)
          onSetAnchor(e.currentTarget)
        }}>
        <Box
          className={classes.menuBox}
          style={
            isMenuOpen ? {boxShadow: '-2px 1px 4px 1px rgba(0, 0, 0, 0.2)'} : {}
          }>
          <MoreVertIcon />
        </Box>
      </IconButton>

      {section !== 'DRAFT' ? (
        <div className={classes.liveIconContainer}>
          <img src={getStatusIcon(section)}></img>
        </div>
      ) : (
        <div className={classes.cardStatus}>Draft</div>
      )}
    </Box>
  )
}

type StudyCardProps = {
  study: Study
  onSetAnchor: Function
  isRename?: boolean
  onRename?: Function
  isNewlyAddedStudy?: boolean
  section: string
  isMenuOpen: boolean
}

const StudyCard: FunctionComponent<StudyCardProps> = ({
  study,
  onSetAnchor,
  isRename,
  onRename,
  isNewlyAddedStudy,
  section,
  isMenuOpen,
}) => {
  const classes = useStyles()
  const input = React.createRef<HTMLInputElement>()

  const handleKeyDown = (
    event: React.KeyboardEvent,
    name: string | undefined
  ) => {
    if (!onRename) {
      return
    }
    const {key} = event

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
        className={clsx(classes.root, isNewlyAddedStudy && classes.isJustAdded)}
        onClick={e => {
          if (isRename) {
            cancelPropagation(e)
          }
        }}>
        <>
          <CardTop
            section={section}
            study={study}
            onSetAnchor={onSetAnchor}
            isMenuOpen={isMenuOpen}></CardTop>
        </>
        <CardContent>
          <div>
            {!isRename && (
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.studyNameText}
                gutterBottom={study.phase === 'design' ? true : false}>
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
          <Typography className={classes.studyId} color="textSecondary">
            Study ID: {Utility.formatStudyId(study.identifier)}
          </Typography>
          {false && <DraftIcon />}
        </CardContent>
        <CardBottom study={study}></CardBottom>
      </Card>
    </>
  )
}

export default StudyCard
