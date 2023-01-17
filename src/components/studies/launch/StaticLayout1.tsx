import {Box, Container, Typography} from '@mui/material'
import {useStudy} from '@services/studyHooks'
import {theme} from '@style/theme'
import React from 'react'
import {useParams} from 'react-router-dom'

const Live: React.FunctionComponent<{
  image: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
}> = ({title, image, children, subtitle}) => {
  let {id} = useParams<{
    id: string
  }>()

  const {data: study, error: studyError} = useStudy(id)
  if (!study) {
    return <></>
  }
  return (
    <>
      <Box sx={{background: ' rgba(135, 142, 149, 0.1)'}}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            height: '786px',
            /*height: 'calc(100vh - 150px)',*/ justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {image}
          <Box sx={{minWidth: '300px', flexShrink: 0}}>
            {title && (
              <Typography variant="h2" sx={{marginBottom: theme.spacing(2)}}>
                {title}
              </Typography>
            )}
            {subtitle && <Typography sx={{fontSize: '16px', display: 'flex'}}>{subtitle}</Typography>}
          </Box>
        </Container>
      </Box>
      <Box>
        {children && (
          <Box
            sx={{
              background: '#FFFFFF',
              boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.05)',
              height: '80px',
              padding: theme.spacing(2.5, 0),
              textAlign: 'center',
            }}>
            {children}
          </Box>
        )}
      </Box>
    </>
  )
}

export default Live
