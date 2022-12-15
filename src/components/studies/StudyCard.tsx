import {ReactComponent as ParticipantsIcon} from '@assets/participants_icon.svg'
import Utility from '@helpers/utility'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Box, IconButton, styled, TextField} from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import StudyService from '@services/study.service'
import {shouldForwardProp, theme} from '@style/theme'
import {DisplayStudyPhase, Study} from '@typedefs/types'
import dayjs from 'dayjs'
import React, {FunctionComponent} from 'react'
import {useAdherenceForWeek} from './adherenceHooks'

const StyledCard = styled(Card, {label: 'StyledCard'})(({theme}) => ({
  width: '357px',
  height: '206px',
  position: 'relative',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  borderRadius: '0px',
  //boxShadow: '0 4px 4px 0 rgb(0 0 0 / 35%)',
  boxShadow: '0px 5px 14px #EAECEE',
  boxSizing: 'border-box',

  '&:hover': {
    outline: `3px solid ${theme.palette.accent.purple}`,
  },
}))

const StyledCardTop = styled(Box, {label: 'StyledCardTop'})(({theme}) => ({
  marginTop: theme.spacing(0.5),
  width: '100%',
  display: 'flex',
  textAlign: 'left',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '40px',
}))

const StyledCardBottom = styled(Box, {label: 'StyledCardBottom'})(({theme}) => ({
  display: 'flex',
  textAlign: 'left',
  paddingTop: '8px',
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  right: '8px',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: '#878E95',
}))

const ParticipantsIconContainer = styled(Box, {label: 'ParticipantsIconContainer'})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  '> svg': {
    width: '25px',
    height: '25px',
    marginRight: theme.spacing(0.5),
    stroke: '#AEB5BC',
    fill: '#AEB5BC',
    '> path': {
      stroke: '#AEB5BC',
      fill: '#AEB5BC',
    },
  },
}))

const textColor = (status: DisplayStudyPhase) => {
  switch (status) {
    case 'COMPLETED':
      return '#47A4DD'
    case 'DRAFT':
      return '#C22E49'
    case 'LIVE':
      return '#63A650'
    default:
      return '#4f527d'
  }
}

const StatusText = styled(Typography, {label: 'StatusText', shouldForwardProp: shouldForwardProp})<{
  $displayStatus: DisplayStudyPhase
}>(({theme, $displayStatus}) => ({
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '14px',
  textAlign: 'right',
  color: textColor($displayStatus),
}))

const cancelPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
}

const getFormattedDate = (date: Date) => {
  return dayjs(date).format('MMM D, YYYY @ h:mma')
}

const CardBottom: FunctionComponent<{
  study: Study
}> = ({study}: {study: Study}) => {
  const date = new Date(study.phase === 'design' ? study.modifiedOn! : study.createdOn!)
  const {data: adherenceWeeklyInProcessCount} = useAdherenceForWeek(study.identifier, 0, 5, {
    progressionFilters: ['in_progress'],
  })

  return (
    <StyledCardBottom>
      <Box>
        <strong>{study.phase === 'design' ? `Last Edited` : `Launched:`}</strong>
        <br />
        {`${getFormattedDate(date)}`}
      </Box>

      {study.phase !== 'design' && (
        <ParticipantsIconContainer>
          <ParticipantsIcon title="Number of Participants" />
          {adherenceWeeklyInProcessCount?.total.toString() || '--'}
        </ParticipantsIconContainer>
      )}
    </StyledCardBottom>
  )
}

const CardTop: FunctionComponent<StudyCardProps> = ({onSetAnchor, study, isMenuOpen}: StudyCardProps) => {
  const displayStatus = StudyService.getDisplayStatusForStudyPhase(study.phase)

  return (
    <StyledCardTop>
      <IconButton
        style={{
          padding: '0',
        }}
        onClick={e => {
          cancelPropagation(e)
          onSetAnchor(e.currentTarget)
        }}>
        <Box //style={isMenuOpen ? {boxShadow: '-2px 1px 4px 1px rgba(0, 0, 0, 0.2)'} : {}}
        >
          <MoreVertIcon sx={{fontSize: '32px'}} />
        </Box>
      </IconButton>

      <StatusText $displayStatus={displayStatus} sx={{marginTop: theme.spacing(0.5), marginRight: theme.spacing(1.25)}}>
        {displayStatus.slice(0, 1).toUpperCase() + displayStatus.slice(1).toLowerCase()}
      </StatusText>
    </StyledCardTop>
  )
}

type StudyCardProps = {
  study: Study
  onSetAnchor: Function
  isRename?: boolean
  onRename?: Function
  isNewlyAddedStudy?: boolean

  isMenuOpen: boolean
}

const StudyCard: FunctionComponent<StudyCardProps> = ({
  study,
  onSetAnchor,
  isRename,
  onRename,
  isNewlyAddedStudy,
  //section,
  isMenuOpen,
}) => {
  const input = React.createRef<HTMLInputElement>()

  const handleKeyDown = (event: React.KeyboardEvent, name: string | undefined) => {
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
      <StyledCard
        sx={
          isNewlyAddedStudy
            ? {animation: '$pop-out 0.5s ease', outline: `4px solid ${theme.palette.accent.purple}`}
            : {}
        }
        onClick={e => {
          if (isRename) {
            cancelPropagation(e)
          }
        }}>
        <>
          <CardTop study={study} onSetAnchor={onSetAnchor} isMenuOpen={isMenuOpen}></CardTop>
        </>
        <CardContent sx={{textAlign: 'center'}}>
          <div>
            {!isRename && (
              <Typography variant="h4" gutterBottom={study.phase === 'design' ? true : false}>
                {study.name}
              </Typography>
            )}
            {isRename && (
              <TextField
                variant="outlined"
                defaultValue={study.name}
                size="small"
                sx={{marginBottom: theme.spacing(2)}}
                inputRef={input}
                onBlur={e => onRename && onRename(input.current?.value)}
                onKeyDown={e => handleKeyDown(e, input.current?.value)}
                onClick={e => cancelPropagation(e)}
              />
            )}
          </div>
          <Typography
            sx={{
              color: '#878E95',
              fontSize: '14px',
            }}>
            Study ID: {Utility.formatStudyId(study.identifier)}
          </Typography>
        </CardContent>
        <CardBottom study={study}></CardBottom>
      </StyledCard>
    </>
  )
}

export default StudyCard
