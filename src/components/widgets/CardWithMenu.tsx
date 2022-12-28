import Utility from '@helpers/utility'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Box, IconButton, styled, TextField} from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import {shouldForwardProp, theme} from '@style/theme'
import {DisplayStudyPhase} from '@typedefs/types'
import dayjs from 'dayjs'
import React, {FunctionComponent} from 'react'

export type StatusColor = '#47A4DD' | '#C22E49' | '#63A650' | '#4f527d'

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

const StatusText = styled(Typography, {label: 'StatusText', shouldForwardProp: shouldForwardProp})<{
  $statusColor?: StatusColor
}>(({theme, $statusColor}) => ({
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '14px',
  textAlign: 'right',
  color: $statusColor,
}))

const cancelPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
}

export const getFormattedDate = (date: Date) => {
  return dayjs(date).format('MMM D, YYYY @ h:mma')
}

const CardTop: FunctionComponent<
  Pick<CardWithMenuProps, 'onSetAnchor' | 'statusColor' | 'isMenuOpen'> & {
    children: React.ReactNode
    statusColor: StatusColor
  }
> = ({onSetAnchor, children, statusColor}) => {
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
        <Box>
          <MoreVertIcon sx={{fontSize: '32px'}} />
        </Box>
      </IconButton>

      <StatusText $statusColor={statusColor} sx={{marginTop: theme.spacing(0.5), marginRight: theme.spacing(1.25)}}>
        {children}
      </StatusText>
    </StyledCardTop>
  )
}

type CardWithMenuProps = {
  name: string
  identifier: string
  onSetAnchor: Function
  isRename?: boolean
  onRename?: Function
  shouldHighlight?: boolean
  leftBottomChild?: React.ReactNode
  rightBottomChild?: React.ReactNode
  shouldHaveSpaceAfterName?: boolean
  topStatus?: DisplayStudyPhase | 'Unknown'
  statusColor: StatusColor

  isMenuOpen: boolean
}

const CardWithMenu: FunctionComponent<CardWithMenuProps> = ({
  //  study,
  name,
  identifier,
  leftBottomChild,
  rightBottomChild,
  onSetAnchor,
  isRename,
  onRename,
  shouldHighlight,
  statusColor,
  isMenuOpen,
  topStatus,
  shouldHaveSpaceAfterName,
}) => {
  const input = React.createRef<HTMLInputElement>()

  const handleKeyDown = (event: React.KeyboardEvent, newName: string | undefined) => {
    if (!onRename) {
      return
    }
    const {key} = event

    const enterKey = 'Enter'

    if (key === 'Escape') {
      onRename(name)
    }
    if (key === 'Tab' || key === enterKey) {
      onRename(newName)
    }
  }

  return (
    <>
      <StyledCard
        sx={
          shouldHighlight ? {animation: '$pop-out 0.5s ease', outline: `4px solid ${theme.palette.accent.purple}`} : {}
        }
        onClick={e => {
          if (isRename) {
            cancelPropagation(e)
          }
        }}>
        <>
          <CardTop statusColor={statusColor} onSetAnchor={onSetAnchor} isMenuOpen={isMenuOpen}>
            {topStatus}
          </CardTop>
        </>
        <CardContent sx={{textAlign: 'center'}}>
          <div>
            {!isRename && (
              <Typography variant="h4" gutterBottom={shouldHaveSpaceAfterName}>
                {name}
              </Typography>
            )}
            {isRename && (
              <TextField
                variant="outlined"
                defaultValue={name}
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
            Study ID: {Utility.formatStudyId(identifier)}
          </Typography>
        </CardContent>
        <StyledCardBottom>
          <Box>{leftBottomChild}</Box>

          {rightBottomChild && <ParticipantsIconContainer>{rightBottomChild}</ParticipantsIconContainer>}
        </StyledCardBottom>
      </StyledCard>
    </>
  )
}

export default CardWithMenu
