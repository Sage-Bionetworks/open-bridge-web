import { Box, createStyles, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { Assessment } from '../../types/types'
import AssessmentImage from './AssessmentImage'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      padding: 0,
      marginBottom: theme.spacing(1),

      '&.dragging': {
        border: '1px dashed #000',
        padding: '5px',
      },
      '&:hover': {
        border: '2px solid #000',

        '& $text $hoverImage': {
          display: 'block',
          position: 'absolute',
          right: '5px',
          width: '20px',
          height: '20px',
          top: '0',
          bottom: '0',
          margin: 'auto',
        },
      },
      '&.no-hover:hover': {
        border: 'none',
        '& $text $hoverImage': {
          display: 'none',
        }
      },
    },

    card: {
      width: '96px',
      height: '96px',
      flexShrink: 0,
      display: 'flex',
      alignContent: 'space-around',
      justifyContent: 'space-around',
    },
    title: {
      fontSize: '12px',
    },
    text: {
      padding: theme.spacing(1),
      paddingRight: theme.spacing(3),
      backgroundColor: '#E0E0E0',
      position: 'relative',

      flexGrow: 1,
      textAlign: 'left',
    },
    duration: {
      fontSize: '13px',
    },
    hoverImage: {
      display: 'none',
    },
  }),
)

type AssessmentSmallOwnProps = {
  assessment: Assessment
  isDragging?: boolean
  isHideDuration?: boolean
  hasHover?: boolean
}

type AssessmentSmallProps = AssessmentSmallOwnProps

const AssessmentSmall: FunctionComponent<AssessmentSmallProps> = ({
  assessment,
  isDragging,
  isHideDuration,
  hasHover = true,
  children,
}) => {
  const classes = useStyles()

  return (
    <Paper
      className={clsx(
        classes.root,
        !hasHover && 'no-hover',
        isDragging && 'dragging',
      )}
    >
      <Box className={classes.card}>
        <AssessmentImage
          isSmall={true}
          resources={assessment.resources}
          name={assessment.title}
        ></AssessmentImage>
      </Box>
      <div className={classes.text}>
        <div className={classes.hoverImage}> &#9776;</div>
        <span className={classes.title}>
          {assessment.title}

          {!isHideDuration && (
            <div className={classes.duration}>
              {assessment.duration} min
            </div>
          )}
        </span>
        {children}
      </div>
    </Paper>
  )
}

export default AssessmentSmall
