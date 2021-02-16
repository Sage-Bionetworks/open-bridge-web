import { makeStyles } from '@material-ui/core'
import LiveIconImage from '../../assets/live_study_icon.svg'

const useStyles = makeStyles(theme => ({
  liveContainer: {
    width: '68px',
    height: '24px',
    borderRadius: '25px',
    backgroundColor: '#51A3A3',
    outline: 'none',
    display: 'flex',
    color: 'white',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: theme.spacing(0, 0.5),
    fontFamily: "Lato"
  },
  icon: {
    width: '20px',
    height: '20px',
  },
}))

const LiveIcon: React.FC<{}> = props => {
  const classes = useStyles()
  return (
    <div className={classes.liveContainer}>
      <img src={LiveIconImage} className={classes.icon} alt="Live"></img>
      <div>Live</div>
    </div>
  )
}

export default LiveIcon
