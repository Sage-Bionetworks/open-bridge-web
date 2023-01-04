import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'
import MediationTwoToneIcon from '@mui/icons-material/MediationTwoTone'
import {Alert, Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {Assessment, ExtendedError} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useHistory} from 'react-router-dom'
import CollapsableMenu from './widgets/MenuDropdown'

const useStyles = makeStyles(theme => ({
  rootSurveyTopNav: {
    backgroundColor: '#F7F7F7',
    padding: theme.spacing(0),
    borderBottom: `1px solid #DFDFDF`,
  },
  logo: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  toolbarStudyHeader: {
    padding: theme.spacing(2.5, 5, 0, 5),
    height: theme.spacing(9),
    display: 'flex',
    backgroundColor: '#F7F7F7', //'#F8F8F8',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  toolbar: {
    alignItems: 'center',
    minHeight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',

    '&:last-child': {
      paddingRight: 0,
    },
  },

  selectedLink: {
    borderBottom: '4px solid black',
    paddingBottom: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    float: 'right',
    '&::after': {
      content: '',
      display: 'table',
      clear: 'both',
    },
  },
  drawer: {
    width: '320px',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '320px',

    '& $toolbarLink': {
      flextGroup: 0,
      padding: theme.spacing(1, 2),
      fontStyle: 'normal',
      textTransform: 'uppercase',
    },

    '& $toolbarLink:first-child': {
      paddingLeft: '8px',
    },

    '& $selectedLink': {
      border: 'none',
      fontWeight: 'bolder',
    },
    backgroundColor: '#F8F8F8',
  },
  toolbarLink: {
    padding: theme.spacing(2),
    flexGrow: 1,
    fontFamily: latoFont,
    fontSize: '15px',

    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,

    '&:first-child': {
      // paddingLeft: theme.spacing(0.5),
    },
    '&:last-child': {
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
    },
    '&$selectedLink': {
      paddingTop: '20px',
    },
  },
  mobileToolBarLink: {
    fontFamily: latoFont,
    fontSize: '15px',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    height: '56px',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#fff',
    },
    display: 'flex',
    alignItems: 'center',
    borderLeft: '4px solid transparent',
  },
  mobileSelectedLink: {
    borderLeft: '4px solid #353535',
    fontWeight: 'bolder',
  },
  blackXIcon: {
    width: '16px',
    height: '16px',
  },
  accessSettingsDrawerOption: {
    display: 'flex',
    marginTop: theme.spacing(4),
  },
}))

type SurveyTopNavProps = {
  survey?: Assessment
  error: ExtendedError | null
}

const ALL_LINKS: {path: string; name: string; icon: React.ReactElement}[] = [
  {
    path: `${constants.restrictedPaths.SURVEY_BUILDER}`,
    name: 'SURVEY DESIGN',

    icon: <BuildTwoToneIcon />,
  },
  {name: 'BRANCHING LOGIC', path: `${constants.restrictedPaths.SURVEY_BRANCHING}`, icon: <MediationTwoToneIcon />},
]

const SurveyTopNav: FunctionComponent<SurveyTopNavProps> = ({survey, error}: SurveyTopNavProps) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const classes = useStyles()

  const links = ALL_LINKS.map(link => ({
    ...link,
    enabled: true,
    path: link.path.replace(':id', survey?.guid ?? ''),
    display: /*link.icon + */ link.name,
    id: link.path,
  }))

  const history = useHistory()

  return (
    <Box>
      <CollapsableMenu
        items={links}
        selectedFn={section => history.location.pathname.includes(section.path)}
        displayMobileItem={(section, isSelected) => (
          <>
            {section.icon} &nbsp;{section.name}
          </>
        )}
        displayDesktopItem={(section, isSelected) => (
          <>
            {' '}
            {section.icon}
            {section.name}
          </>
        )}
        onClick={section => history.push(section.path)}
      />

      {error && (
        <Box mx="auto" textAlign="center">
          <Alert variant="outlined" color="error" style={{marginBottom: '10px'}}>
            {' '}
            {error.statusCode}
            You do not have the permission to access this feature. Please contact your study administrator
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default SurveyTopNav
