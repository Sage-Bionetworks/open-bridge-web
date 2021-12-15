import {Box} from '@material-ui/core'
import StudyService from '@services/study.service'
import {Study} from '@typedefs/types'
import React from 'react'
import {NavLink} from 'react-router-dom'
import {ReactComponent as ArrowIcon} from '../../assets/arrow_long.svg'
import {NextButton, PrevButton} from '../widgets/StyledComponents'
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

  const sectionLinks = getStudyBuilderSections(
    StudyService.isStudyInDesign(study)
  )
  const currentIndex = sectionLinks.findIndex(i => i.path === currentSection)
  const prev = currentIndex > 0 ? sectionLinks[currentIndex - 1] : undefined
  const next =
    currentIndex + 1 < sectionLinks.length
      ? sectionLinks[currentIndex + 1]
      : undefined
  const prevButton = prev ? (
    <NavLink
      to={`/studies/builder/${study.identifier}/${prev.path}`}
      style={{textDecoration: 'none'}}>
      <PrevButton variant="outlined" color="primary">
        <ArrowIcon /> {prev.buttonName || prev.name}
      </PrevButton>
    </NavLink>
  ) : (
    <></>
  )

  const nextButton = next ? (
    <NavLink
      to={disabled ? '#' : `/studies/builder/${study.identifier}/${next.path}`}
      style={{textDecoration: 'none'}}>
      <NextButton
        variant="contained"
        color="primary"
        disabled={disabled || false}>
        {next.buttonName || next.name} <ArrowIcon />
      </NextButton>
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
    <Box py={2} textAlign="right">
      {prev && <> {prevButton} &nbsp;&nbsp; </>}
      {nextButton}
    </Box>
  )
}

export default NavButtons
