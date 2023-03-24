import {ReactComponent as MtbSymbol} from '@assets/logo_mtb_symbol.svg'
import BreadCrumb from '@components/widgets/BreadCrumb'
import Loader from '@components/widgets/Loader'
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone'
import CakeTwoToneIcon from '@mui/icons-material/CakeTwoTone'
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone'
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone'
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone'
import StarsTwoToneIcon from '@mui/icons-material/StarsTwoTone'
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone'
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone'
import {Box, Container, Divider, Grid, Hidden, styled, Typography} from '@mui/material'
import {useAssessmentWithResources} from '@services/assessmentHooks'
import {latoFont, theme} from '@style/theme'
import React, {FunctionComponent, ReactElement} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {RouteComponentProps, useLocation, useParams} from 'react-router-dom'
import AssessmentImage from './AssessmentImage'

const InfoTextInContainer = styled(Box)(({theme}) => ({
  fontSize: '14px',
  lineHeight: '18px',
}))

const StyledDivider = styled(Divider)(({theme}) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
  width: '100%',
  backgroundColor: '#EAECEE',
}))

type AssessmentDetailOwnProps = {}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const SectionWithIcon: FunctionComponent<{icon: ReactElement; heading: string; text: string}> = ({
  icon,
  heading,
  text,
}) => {
  return (
    <Box>
      <Box sx={{display: 'flex', alignItems: 'center', ' > svg': {color: '#878E95'}}}>
        {icon}
        <Typography variant="h4" sx={{marginLeft: theme.spacing(1)}}>
          {heading}
        </Typography>
      </Box>
      <Typography variant="body1" component={'p'} sx={{display: 'block', margin: theme.spacing(0.5, 0, 4, 0)}}>
        {text}
      </Typography>
    </Box>
  )
}

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = () => {
  const [view] = React.useState(new URLSearchParams(useLocation().search).get('viewType'))
  let {id} = useParams<{id: string}>()
  const handleError = useErrorHandler()

  const {data, isError, error, isLoading} = useAssessmentWithResources(id)

  if (isError) {
    handleError(error!)
  }
  if (isLoading || !data) {
    return <Loader reqStatusLoading={true} />
  }

  const Header = (
    <>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography
          component={'p'}
          sx={{
            fontWeight: '400',
            fontSize: '14px',
            lineHeight: '18px',
            textTransform: 'uppercase',
          }}>
          {data.tags.join(', ')}
        </Typography>
        <Box sx={{display: 'flex'}}>
          <MtbSymbol
            title="official_mobile_toolbox_icon"
            style={{
              marginRight: '8px',
              width: '20px',
              height: '20px',
            }}
          />

          <Typography component="span">Official Mobile Toolbox version</Typography>
        </Box>
      </Box>
      <Typography variant="h2" sx={{margin: {lg: theme.spacing(2, 0), md: theme.spacing(4, 0)}}}>
        {data.title}
      </Typography>
    </>
  )

  return (
    <Box sx={{backgroundColor: '#fff'}}>
      <Container
        sx={{
          textAlign: 'center',
          paddingBottom: theme.spacing(6),
          backgroundColor: '#fff',

          minHeight: '100vh',

          maxWidth: {
            lg: theme.breakpoints.values['lg'],
            xs: theme.breakpoints.values['sm'],
          },
        }}>
        <Box
          sx={{
            padding: theme.spacing(3, 5, 0, 3),
            boxShadow: '0 0 0 0',
            marginBottom: 6,
          }}>
          <BreadCrumb
            links={[{url: `/assessments?viewType=${view}`, text: 'Back to Assessments'}]}
            sx={{fontSize: '16px'}}></BreadCrumb>
        </Box>

        <InfoTextInContainer>
          <Grid
            container
            columnSpacing={{xs: 0, lg: 4}}
            sx={{
              padding: {
                lg: theme.spacing(1, 4),
                md: theme.spacing(3, 3),
              },
              borderRadius: '0px',
            }}>
            <Grid item xs={12} lg={6}>
              <Box style={{textAlign: 'left'}}>
                <Hidden lgUp>
                  {/*  */}
                  {Header}
                </Hidden>
                <AssessmentImage
                  name={`${data.title}_img`}
                  resources={data.resources}
                  variant="detail"></AssessmentImage>
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box textAlign="left" sx={{fontFamily: latoFont}}>
                {' '}
                <Hidden lgDown>{Header}</Hidden>
                <Box sx={{fontSize: '16px', lineHeight: '20px', marginTop: {lg: 0, md: theme.spacing(3)}}}>
                  {data.summary}
                </Box>
                <StyledDivider />
                <Box sx={{width: '100%', '> div': {width: '50%', float: 'left'}}}>
                  <Box>
                    <SectionWithIcon
                      icon={<VerifiedTwoToneIcon />}
                      heading="Validation"
                      text="Scientifically Validated"
                    />

                    <SectionWithIcon icon={<CakeTwoToneIcon />} heading="Age" text="todo: age" />
                  </Box>
                  <Box>
                    <SectionWithIcon
                      icon={<TimerTwoToneIcon />}
                      heading="Duration"
                      text={`${data.minutesToComplete} min`}
                    />
                    <SectionWithIcon icon={<ChatBubbleTwoToneIcon />} heading="Language" text="todo:" />
                  </Box>
                </Box>
                <Box sx={{clear: 'left'}}>
                  <SectionWithIcon icon={<StarsTwoToneIcon />} heading="Score" text="todo: " />
                  <SectionWithIcon icon={<FactCheckTwoToneIcon />} heading="Reliability" text="todo: " />
                  <SectionWithIcon icon={<ArticleTwoToneIcon />} heading="Publications" text="todo: " />
                  <SectionWithIcon icon={<MenuBookTwoToneIcon />} heading="Technical Manual" text="" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </InfoTextInContainer>
      </Container>
    </Box>
  )
}

export default AssessmentDetail
