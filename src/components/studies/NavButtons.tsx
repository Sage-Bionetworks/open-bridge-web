import { Box, Button, makeStyles } from '@material-ui/core'
import React from 'react'
import { ReactComponent as ArrowIcon } from '../../assets/arrow_long.svg'
import { SECTIONS as sectionLinks, StudySection } from './sections'

const useStyles = makeStyles(theme => ({
  prevButton: {
    '& svg': {
      marginRight: theme.spacing(2),
      '& path': {
        fill: '#2a2a2a',
      },
    },
  },
  nextButton: {
    '& svg': {
      marginLeft: theme.spacing(2),
      transform: 'scaleX(-1)',
      '& path': {
        fill: '#fcfcfc',
      },
    },
  },
}))

export interface NavButtonsProps {
  currentSection: StudySection
  id: string
  onNavigate: Function
}

const NavButtons: React.FunctionComponent<NavButtonsProps> = ({
  currentSection,
  id,
  onNavigate,
}: NavButtonsProps) => {
  const classes = useStyles()
  const currentIndex = sectionLinks.findIndex(i => i.path === currentSection)
  const prev = currentIndex > 0 ? sectionLinks[currentIndex - 1] : undefined
  const next =
    currentIndex + 1 < sectionLinks.length
      ? sectionLinks[currentIndex + 1]
      : undefined

  const result = (
    <Box py={2} textAlign="right">
      {prev && (
        <>
          <Button
            variant="outlined"
            color="primary"
            className={classes.prevButton}
            onClick={() => onNavigate(prev.path)}
          >
            <ArrowIcon /> {prev.name}
          </Button>{' '}
          &nbsp;&nbsp;
        </>
      )}

      {next && (
        <>
          <Button
            variant="contained"
            color="primary"
            className={classes.nextButton}
            onClick={() => onNavigate(next.path)}
          >
            {next.name} <ArrowIcon />
          </Button>
        </>
      )}
    </Box>
  )
  return result
}

export default NavButtons
