import {Box, Grid, Tab, Tabs, Typography} from '@mui/material'
import {styled} from '@mui/styles'
import {colors} from '@style/staticPagesTheme'
import React, {FunctionComponent} from 'react'

const HomeTabs = styled(Tabs)(({theme}) => ({
  '& .root': {
    borderBottomWidth: theme.spacing(1),
    borderBottomColor: colors.neutralsGray,
    borderBottomStyle: 'solid',
  },
  '& .MuiTab-root': {
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '29px',
    color: colors.neutralsGray,
    paddingLeft: 0,
    poaddingRight: theme.spacing(10),
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
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
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const Experiences: FunctionComponent<{}> = () => {
  const [value, setValue] = React.useState(0)

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
            Item One
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
