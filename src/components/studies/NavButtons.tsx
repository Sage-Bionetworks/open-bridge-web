import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Box, Button } from '@material-ui/core'
import { SECTIONS as sectionLinks, StudySection } from './sections'

const useStyles = makeStyles({
  root: {},
})

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

  const NavLink = (props: any) => {
    const { id, section } = props

    const go = (loc: string) => {
      window.location.replace(loc)
    }
    if (!section) {
      return <></>
    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => onNavigate(`/studies/builder/${id}/${section.path}`)}
        //onClick={()=> go(`/studies/builder/${id}/${section.path}`)}
      >
        {section.name}
      </Button>
    )
  }
  const result = (
    <Box position="fixed" bottom={24} right={24}>
      <NavLink id={id} section={prev}></NavLink>&nbsp;&nbsp;
      <NavLink id={id} section={next}></NavLink>
    </Box>
  )
  return result
}

export default NavButtons
