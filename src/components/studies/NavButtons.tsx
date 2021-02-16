import { Box, Button } from '@material-ui/core'
import React from 'react'
import { SECTIONS as sectionLinks, StudySection } from './sections'

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
  const currentIndex = sectionLinks.findIndex(i => i.path === currentSection)
  const prev = currentIndex > 0 ? sectionLinks[currentIndex - 1] : undefined
  const next =
    currentIndex + 1 < sectionLinks.length
      ? sectionLinks[currentIndex + 1]
      : undefined

  const NavLink = (props: any) => {
    const {section } = props


    if (!section) {
      return <></>
    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => onNavigate(section.path)}
      >
        {section.name}
      </Button>
    )
  }
  const result = (
    <Box paddingTop={2} textAlign="right">
      <NavLink id={id} section={prev}></NavLink>&nbsp;&nbsp;
      <NavLink id={id} section={next}></NavLink>
    </Box>
  )
  return result
}

export default NavButtons
