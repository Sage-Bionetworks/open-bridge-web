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
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
}))

const LiveIcon: React.FC<{}> = props => {
  const classes = useStyles()
  return (
    <div
      className={classes.liveContainer}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '0px 3px',
      }}
    >
      <img src={LiveIconImage} style={{ width: '20px', height: '20px' }}></img>
      <div>Live</div>
    </div>
  )
}

export default LiveIcon
