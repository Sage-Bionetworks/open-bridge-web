import {Box, Button} from '@mui/material'
import StudyService from '@services/study.service'
import {Study} from '@typedefs/types'
import React from 'react'
import {NavLink} from 'react-router-dom'
import {getStudyBuilderSections, StudySection} from './sections'

export interface NavButtonsProps {
  currentSection: StudySection
  study?: Study

  disabled?: boolean
  isPrevOnly?: boolean
  isNextOnly?: boolean
  isAsArray?: boolean
}

const NavButtons: React.FunctionComponent<NavButtonsProps> = ({
  currentSection,
  isNextOnly,
  isPrevOnly,
  study,

  disabled,
}: NavButtonsProps) => {
  if (!study) {
    return <></>
  }

  const sectionLinks = getStudyBuilderSections(StudyService.isStudyInDesign(study))
  const currentIndex = sectionLinks.findIndex(i => i.path === currentSection)
  const prev = currentIndex > 0 ? sectionLinks[currentIndex - 1] : undefined
  const next = currentIndex + 1 < sectionLinks.length ? sectionLinks[currentIndex + 1] : undefined
  const prevButton = prev ? (
    <NavLink to={`/studies/builder/${study.identifier}/${prev.path}`} style={{textDecoration: 'none'}}>
      <Button variant="outlined" color="primary" disabled={disabled || false}>
        {prev.buttonName || prev.name}
      </Button>
    </NavLink>
  ) : (
    <></>
  )

  const nextButton = next ? (
    <NavLink to={disabled ? '#' : `/studies/builder/${study.identifier}/${next.path}`} style={{textDecoration: 'none'}}>
      <Button variant="contained" color="primary" disabled={disabled || false}>
        {next.buttonName || next.name}
      </Button>
    </NavLink>
  ) : (
    <></>
  )

  if (isNextOnly) {
    return nextButton
  }
  if (isPrevOnly) {
    return prevButton
  }

  return (
    <Box py={2} textAlign="right" mr={2}>
      {prev && <> {prevButton} &nbsp;&nbsp; </>}
      {nextButton}
    </Box>
  )
}

export default NavButtons
