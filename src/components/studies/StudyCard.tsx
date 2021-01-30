import { Box, IconButton, TextField } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React, { FunctionComponent } from 'react'
import { ThemeType } from '../../style/theme'
import { Study } from '../../types/types'
import LiveIcon from './LiveIcon'
import participants_icon from '../../assets/participants_icon.svg'

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
    border: '1px solid gray',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: '0px',
    borderWidth: '0px',
    boxShadow: '0 4px 4px 0 rgb(0 0 0 / 35%)',
  },

  title: {
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: 'bold',
    fontStyle: '12px',
  },
}))

const cancelPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
}

const CardBottom: FunctionComponent<{
  study: Study
}> = ({ study }: { study: Study }) => {
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
      <div style={{ width: '100%', padding: '0 5px' }}>
        {study.status === 'DRAFT' ? (
          <text
            style={{
              fontFamily: 'Lato',
              fontSize: '10px',
              fontWeight: 'lighter',
            }}
          >
            Last edited:
          </text>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              fontFamily: 'Lato',
              fontSize: '12px',
            }}
          >
            <img
              src={participants_icon}
              style={{ width: '25px', height: '25px', marginRight: '3px' }}
            />
            [56]
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            fontFamily: 'Lato',
            fontWeight: 'lighter',
            fontSize: '10px',
          }}
        >
          <text>
            {study.status === 'DRAFT'
              ? '[Dec. 2nd, 2018 @ 4:45pm]'
              : '[Launched: Nov. 1, 2019 @ 4:45 pm]'}
          </text>
          <text>[Lynn B.]</text>
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

  return (
    <Box
      display="flex"
      textAlign="left"
      paddingTop="8px"
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '10px 10px',
        alignItems: 'center',
      }}
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
        <div style={{ marginTop: '5px', marginRight: '5px' }}>
          <LiveIcon />
        </div>
      ) : (
        <div
          style={{
            fontFamily: 'Playfair Display',
            fontStyle: 'italic',
            fontSize: 'small',
            marginTop: '5px',
            marginRight: '10px',
          }}
        >
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

const StudyCard: FunctionComponent<StudyCardProps> = ({
  study,
  onSetAnchor,
  isRename,
  onRename,
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
    const keys = ['Escape', 'Tab']
    const enterKey = 'Enter'
    const allKeys = [...keys, enterKey]
    console.log(key)
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
        className={classes.root}
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
                style={{ fontFamily: 'Poppins', fontSize: '18px' }}
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
                style={{ marginBottom: '16px' }}
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
