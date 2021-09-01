import {Box} from '@material-ui/core'
import React from 'react'
import {NavLink} from 'react-router-dom'
import {ReactComponent as ArrowIcon} from '../../assets/arrow_long.svg'
import {NextButton, PrevButton} from '../widgets/StyledComponents'
import {getStudyBuilderSections, StudySection} from './sections'

export interface NavButtonsProps {
  currentSection: StudySection
  id: string

  disabled?: boolean
  isPrevOnly?: boolean
  isNextOnly?: boolean
  isAsArray?: boolean
}

const NavButtons: React.FunctionComponent<NavButtonsProps> = ({
  currentSection,
  isNextOnly,
  isPrevOnly,
  id,

  disabled,
}: NavButtonsProps) => {
  const sectionLinks = getStudyBuilderSections()
  const currentIndex = sectionLinks.findIndex(i => i.path === currentSection)
  const prev = currentIndex > 0 ? sectionLinks[currentIndex - 1] : undefined
  const next =
    currentIndex + 1 < sectionLinks.length
      ? sectionLinks[currentIndex + 1]
      : undefined

  const prevButton = prev ? (
    <NavLink
      to={`/studies/builder/${id}/${prev.path}`}
      style={{textDecoration: 'none'}}>
      <PrevButton variant="outlined" color="primary">
        <ArrowIcon /> {prev.name}
      </PrevButton>
    </NavLink>
  ) : (
    <></>
  )

  const nextButton = next ? (
    <NavLink
      to={`/studies/builder/${id}/${next.path}`}
      style={{textDecoration: 'none'}}>
      <NextButton
        variant="contained"
        color="primary"
        disabled={disabled || false}>
        {next.name} <ArrowIcon />
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
