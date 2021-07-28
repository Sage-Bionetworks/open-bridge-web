import {makeStyles, createStyles, Theme} from '@material-ui/core'
import {poppinsFont} from '../../../../style/theme'

export default makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
    },
    assessments: {
      width: '286px',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: '#BCD5E4',
      padding: theme.spacing(1),
    },
    scheduleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: theme.spacing(2),
    },
    studyStartDateContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    readOnlyAssessmentContainer: {
      backgroundColor: '#f8f8f8',
    },
  })
)
