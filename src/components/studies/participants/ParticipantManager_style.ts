import makeStyles from '@mui/styles/makeStyles'
import {latoFont, poppinsFont} from '@style/theme'

const useStyles = makeStyles(theme => ({
  root: {},
  downloadPageLinkButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex',
    fontFamily: latoFont,
    fontSize: '14px',
  },

  tab: {
    marginRight: theme.spacing(2),
    width: '250px',

    clipPath: 'polygon(10% 0%, 90% 0, 98% 100%,0 100%)',
    marginLeft: theme.spacing(-3.5),
    zIndex: 0,
    backgroundColor: '#F0F0F0',
    fontSize: '12px',
    fontFamily: poppinsFont,

    '& >div': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  gridToolBar: {
    backgroundColor: theme.palette.common.white,
    // padding: theme.spacing(1, 5, 0, 5),
    height: theme.spacing(9),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    '&  button': {
      display: 'flex',
      fontFamily: latoFont,
      fontSize: '14px',
    },
  },

  tabPanel: {
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    padding: theme.spacing(0, 0, 2, 0),
  },
  studyId: {
    color: '#393434',
    marginRight: '24px',
  },

  topRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
  },
  horizontalGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  disabledImage: {
    opacity: 0.5,
  },
  topRowImage: {
    marginRight: theme.spacing(0.75),
  },
  deleteIcon: {
    height: '17px',
    width: '13px',
  },
  addParticipantIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: '#AEDCC9',
    paddingTop: theme.spacing(1.5),
  },
  selectedTab: {
    zIndex: 100,
    backgroundColor: theme.palette.common.white,
  },
  withdrawnParticipants: {
    width: '270px',
  },
  tab_icon: {
    borderBottom: '1px solid transparent',
  },
  unactiveTabIcon: {
    '&:hover div': {
      borderBottom: '1px solid black',
    },
  },
  collapsedAddTestUser: {
    '& > rect': {
      fill: '#AEDCC9',
    },
  },
  primaryDialogButton: {
    border: 'none',
    height: '48px',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

export default useStyles
