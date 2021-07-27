import {Box} from '@material-ui/core'
import React from 'react'
import {ReactComponent as ArrowIcon} from '../../assets/arrow_long.svg'
import {NextButton, PrevButton} from '../widgets/StyledComponents'
import {SECTIONS as sectionLinks, StudySection} from './sections'

export interface NavButtonsProps {
  currentSection: StudySection
  id: string
  onNavigate: Function
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
  onNavigate,
  disabled,
}: NavButtonsProps) => {
  const currentIndex = sectionLinks.findIndex(i => i.path === currentSection)
  const prev = currentIndex > 0 ? sectionLinks[currentIndex - 1] : undefined
  const next =
    currentIndex + 1 < sectionLinks.length
      ? sectionLinks[currentIndex + 1]
      : undefined

  const prevButton = prev ? (
    <PrevButton
      variant="outlined"
      color="primary"
      onClick={() => onNavigate(prev.path)}>
      <ArrowIcon /> {prev.name}
    </PrevButton>
  ) : (
    <></>
  )

  const nextButton = next ? (
    <NextButton
      variant="contained"
      color="primary"
      onClick={() => onNavigate(next.path)}
      disabled={disabled || false}>
      {next.name} <ArrowIcon />
    </NextButton>
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
