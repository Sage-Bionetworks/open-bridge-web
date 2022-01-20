import {makeStyles} from '@material-ui/core'

export const useCommonStyles = makeStyles(theme => ({
  adherenceGrid: {
    padding: theme.spacing(2, 0),
  },
  adherenceLabel: {
    position: 'absolute',
    top: '-16px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dayCell: {
    padding: '0 8px',
    borderRight: '1px solid black',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-start',
    '&:first-child': {
      borderLeft: '1px solid black',
    },
  },
}))
