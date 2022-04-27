import {default as Experiences1} from '@assets/static/experiences1.png'
import {default as Experiences2} from '@assets/static/experiences2.png'
import {Box, Grid, Tab, Tabs, Typography} from '@mui/material'
import {styled} from '@mui/material/styles' //vs mui/styles
import {colors} from '@style/staticPagesTheme'
import React, {FunctionComponent} from 'react'

const ExperienceTabItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'test',
})<{test?: boolean}>(({theme, test}) => ({
  opacity: test ? 1 : 0.3,
  marginBottom: theme.spacing(20),
  '&:hover': {
    opacity: 1,
  },
  transition: 'opacity 1s',
  '& > h4': {
    marginBottom: theme.spacing(5),
  },
}))

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

const imageList = [Experiences1, Experiences2]
const info = [
  {
    title: 'Activity Home Screen',
    body: (
      <>
        <p>
          Activity schedule is automatically updated for each participant,
          including due dates to help keep them on track.
        </p>
      </>
    ),
    image: Experiences1,
  },
  {
    title: 'De-identified login',
    body: (
      <>
        <p>
          Participants login with a unique identifier known only to Study
          Coordinators. No other uniquely identifying information is collected.
        </p>
      </>
    ),
    image: Experiences2,
  },
  {
    title: 'History of Activities',
    body: (
      <>
        <p>Participants can see the activities they have completed.</p>
      </>
    ),
    image: Experiences1,
  },
  {
    title: 'Opt-in settings for notifications and background data monitoring',
    body: (
      <>
        <p>
          Participants can control their reminders and background data
          collection settings
        </p>
      </>
    ),
    image: Experiences2,
  },
  {
    title: 'Study contact information and Participants Rights',
    body: (
      <>
        <p>
          Study and IRB information is transparently available for participants
          to understand their rights.
        </p>
      </>
    ),
    image: Experiences2,
  },
  {
    title: 'Privacy Dashboard',
    body: (
      <>
        <p>
          Privacy practices are explicitly and clearly stated in a simple
          dashboard
        </p>
      </>
    ),
    image: Experiences2,
  },
]
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
  currentItemIndex: number
  onChangeItem: (n: number) => void
}> = ({startIndex, endIndex, onChangeItem, currentItemIndex}) => {
  console.log(currentItemIndex)
  return (
    <ExperienceTabContainer>
      {info.slice(startIndex, endIndex).map((item, index) => (
        <ExperienceTabItem
          onClick={() => {
            alert(index + startIndex)
            onChangeItem(index + startIndex)
          }}
          test={index + startIndex === currentItemIndex}>
          <Typography variant="h4">{item.title}</Typography>
          {item.body}
        </ExperienceTabItem>
      ))}
    </ExperienceTabContainer>
  )
}

const Experiences: FunctionComponent<{}> = () => {
  const [value, setValue] = React.useState(0)
  const [step, setStep] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <>
      <Typography variant="h2">Experiences</Typography>
      <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
        <Grid item xs={12} md={6}>
          <Typography component="p">
            Mobile toolbox has a web experience for researchers and a mobile app
            experience for study participants. You don't have to have a software
            engineering team to create your own custom app.
          </Typography>
          <Typography component="p">
            Sign up is easy! Simply register for a Sage Bionetworks account to
            begin exploring today.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography component="p">
            Try out the assessments yourself with our demo app or start
            designing your own custom study through our Researcher web. You can
            customize your study schedule, assessments, and the look and feel of
            the app. Preview your study before you release it live for
            participants.
          </Typography>
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
          <TabPanel value={value} index={0}>
            <Box display="flex">
              <ExperienceColumn
                startIndex={0}
                endIndex={4}
                currentItemIndex={step}
                onChangeItem={itemIndex => setStep(itemIndex)}
              />

              <Box mx={4}>
                <img
                  src={info[step].image}
                  width="326px"
                  alt={info[step].title}
                />
              </Box>
              <ExperienceColumn
                startIndex={4}
                currentItemIndex={step}
                onChangeItem={itemIndex => setStep(itemIndex)}
              />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
        </Grid>
      </Grid>
    </>
  )
}

export default Experiences
