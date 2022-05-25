import {Box, styled} from '@mui/material'
import React from 'react'
import {NavLink} from 'react-router-dom'
import AddQuestionMenu from './AddQuestionMenu'

const Container = styled('div')(({theme}) => ({
  display: 'flex',
  flexGrow: 0,
  width: theme.spacing(37),
  border: '1px solid black',
  backgroundColor: '#FCFCFC',
  flexDirection: 'column',
  justifyContent: 'space-between',
}))

const AddQuestion = styled('div')(({theme}) => ({
  border: '1px solid black',
}))

const Row = styled('div')(({theme}) => ({
  height: theme.spacing(6),
  padding: theme.spacing(2),
  width: '100%',
  borderTop: '1px solid #A7A19C',
  backgroundColor: 'transparent',
  color: '#3A3A3A',
  textDecoration: 'none',
}))

const StyledNavLink = styled(NavLink)(({theme}) => ({
  textDecoration: 'none',

  '&:focus, &:hover, &:visited, &:link, &:active': {
    textDecoration: 'none',
  },
}))

const LeftPanel: React.FunctionComponent<{
  children: React.ReactNode
  surveyId?: string
}> = ({surveyId, children}) => {
  return (
    <Container>
      <Box>
        <Row>Survey Name /Preview Link</Row>
        <StyledNavLink to={`/surveys/${surveyId}/design/intro`}>
          <Row>intro</Row>
        </StyledNavLink>
        <StyledNavLink to={`/surveys/${surveyId}/design/title`}>
          <Row>title</Row>
        </StyledNavLink>
        <StyledNavLink to={`/surveys/${surveyId}/design/question?q=3`}>
          <Row>question1</Row>
        </StyledNavLink>
        <StyledNavLink to={`/surveys/${surveyId}/design/question?q=3`}>
          <Row>question2</Row>
        </StyledNavLink>
        <StyledNavLink to={`/surveys/${surveyId}/design/question?q=3`}>
          <Row>question3</Row>
        </StyledNavLink>
        <StyledNavLink to={`/surveys/${surveyId}/design/completion`}>
          <Row>completion</Row>
        </StyledNavLink>
        {children}
      </Box>
      <AddQuestion>
        <AddQuestionMenu />
      </AddQuestion>
    </Container>
  )
}
export default LeftPanel
