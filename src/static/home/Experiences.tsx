import {default as bgLeft} from '@assets/static/bg_left_box.svg'
import {default as bgRight} from '@assets/static/bg_right_box.svg'
import {
  Box,
  Container,
  Grid,
  Hidden,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import {styled} from '@mui/material/styles' //vs mui/styles
import {colors} from '@style/staticPagesTheme'
import React, {FunctionComponent} from 'react'
import SwipeableViews from 'react-swipeable-views'
import {autoPlay} from 'react-swipeable-views-utils'
import Carousel from './Carousel'
import {mobileTabInfo, TabInfo, webTabInfo} from './ExperiencesTextInfo'

const ExperienceTabItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'isActive',
})<{isActive?: boolean}>(({theme, isActive}) => ({
  opacity: isActive ? 1 : 0.3,
  marginBottom: theme.spacing(20),
  '&:hover': {
    opacity: 1,
  },
  transition: 'opacity 1s',
  '& > h4': {
    marginBottom: theme.spacing(5),
  },
}))

const ExperienceContainer = styled(Box)(({theme}) => ({
  backgroundPositionY: 'bottom',
  backgroundPositionX: 'right',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('lg')]: {
    backgroundImage: 'url(' + bgRight + ')',
    marginRight: '-200px',
    paddingRight: '200px',
  },
}))

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const ExperienceTabContainer = styled(Box)(({theme}) => ({
  minWidth: theme.spacing(70),
  maxWidth: theme.spacing(80),
  flexGrow: 0,
  flexShrink: 0,
}))

const HomeTabs = styled(Tabs)(({theme}) => ({
  boxShadow: `inset 0px ${theme.spacing(-1)} 0px ${colors.neutralsGray}`,
  marginBottom: theme.spacing(30),
  '& .MuiTab-root': {
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '29px',
    color: colors.neutralsGray,
    paddingLeft: 0,
    paddingRight: theme.spacing(10),
    textTransform: 'none',
    '&.Mui-selected': {
      color: colors.accent,
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: colors.accent,
    height: theme.spacing(1),
  },
}))

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function a11yProps(index: number) {
  return {
    id: `experiences-tab-${index}`,
    'aria-controls': `experiences-tabpanel-${index}`,
  }
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{p: 0}}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const ExperienceColumn: FunctionComponent<{
  startIndex: number
  endIndex?: number
  tabInfo: TabInfo[]
  currentItemIndex: number
  onChangeItem: (n: number) => void
}> = ({startIndex, endIndex, onChangeItem, currentItemIndex, tabInfo}) => {
  console.log(currentItemIndex)
  return (
    <ExperienceTabContainer>
      {tabInfo.slice(startIndex, endIndex).map((item, index) => (
        <ExperienceTabItem
          key={`${startIndex}_${index}`}
          onClick={() => {
            onChangeItem(index + startIndex)
          }}
          isActive={index + startIndex === currentItemIndex}>
          <Typography variant="h4">{item.title}</Typography>
          {item.body}
        </ExperienceTabItem>
      ))}
    </ExperienceTabContainer>
  )
}

const Experiences: FunctionComponent<{}> = () => {
  const [value, setValue] = React.useState(0)
  const [step, setStep] = React.useState({web: 0, mobile: 0})

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <ExperienceContainer>
      <Typography variant="h2">Experiences</Typography>
      <Grid
        container
        rowSpacing={5}
        sx={{
          backgroundImage: {lg: 'url(' + bgLeft + ')'},
          backgroundPositionY: 'bottom',
          backgroundPositionX: 'left',
          backgroundRepeat: 'no-repeat',

          marginLeft: {lg: -50},
          paddingLeft: {lg: 50},
        }}>
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography component="p">
              Mobile toolbox has a web experience for researchers and a mobile
              app experience for study participants. You don't have to have a
              software engineering team to create your own custom app.
            </Typography>
            <Typography component="p">
              Sign up is easy! Simply register for a Sage Bionetworks account to
              begin exploring today.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography component="p">
              Try out the assessments yourself with our demo app or start
              designing your own custom study through our Researcher web. You
              can customize your study schedule, assessments, and the look and
              feel of the app. Preview your study before you release it live for
              participants.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <HomeTabs
              value={value}
              onChange={handleChange}
              color="primary"
              aria-label="experiences">
              <Tab label="Mobile App" {...a11yProps(0)} />
              <Tab label="Web App" {...a11yProps(1)} />
            </HomeTabs>
          </Box>
          <TabPanel value={value} index={0} key="mobileTab">
            <Hidden lgDown>
              <Box display="flex" justifyContent="space-around">
                <ExperienceColumn
                  startIndex={0}
                  endIndex={4}
                  tabInfo={mobileTabInfo}
                  currentItemIndex={step.mobile}
                  onChangeItem={itemIndex =>
                    setStep(prev => ({...prev, mobile: itemIndex}))
                  }
                />

                <Box mx={4}>
                  <img
                    src={mobileTabInfo[step.mobile].image}
                    width="326px"
                    alt={mobileTabInfo[step.mobile].title}
                  />
                </Box>
                <ExperienceColumn
                  startIndex={4}
                  tabInfo={mobileTabInfo}
                  currentItemIndex={step.mobile}
                  onChangeItem={itemIndex =>
                    setStep(prev => ({...prev, mobile: itemIndex}))
                  }
                />
              </Box>
            </Hidden>
            <Hidden lgUp>
              <Box alignContent={'center'} px={5}>
                <Carousel
                  activeStep={step.mobile}
                  variant="text"
                  position="top"
                  onChangeStep={itemIndex =>
                    setStep(prev => ({...prev, mobile: itemIndex}))
                  }
                  elements={mobileTabInfo.map((element, index) => (
                    <Box textAlign="center" mx="auto">
                      <Typography variant="h2" mb={12}>
                        {element.title}
                      </Typography>

                      <Box>{element.body}</Box>
                      <Box>{`${index + 1}/${mobileTabInfo.length}`}</Box>
                      <img src={element.image} alt={element.title} />
                    </Box>
                  ))}></Carousel>
              </Box>
            </Hidden>
          </TabPanel>
          <TabPanel value={value} index={1} key="desktopTab">
            <Grid container columnSpacing={{xs: 2, md: 4}}>
              {webTabInfo.map((item, index) => (
                <Grid
                  item
                  key={`${index}`}
                  xs={3}
                  onClick={() => setStep(prev => ({...prev, web: index}))}>
                  <ExperienceTabItem isActive={index === step.web}>
                    <Typography variant="h4">{item.title}</Typography>
                    {item.body}
                  </ExperienceTabItem>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Container>
                  <Box mx={4} textAlign="center">
                    <img
                      alt={webTabInfo[step.web].title}
                      src={webTabInfo[step.web].image}
                    />
                  </Box>
                </Container>
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </ExperienceContainer>
  )
}

export default Experiences
