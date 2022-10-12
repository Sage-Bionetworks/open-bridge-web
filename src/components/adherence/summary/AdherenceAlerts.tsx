import {ReactComponent as AdherenceRed} from '@assets/adherence/adherence_icon_red.svg'
import {ReactComponent as CalendarBlue} from '@assets/adherence/calendar_blue.svg'
import {ReactComponent as PersonIcon} from '@assets/adherence/person_icon.svg'
import {ReactComponent as CheckEmpty} from '@assets/adherence/round_check_empty.svg'
import {ReactComponent as CheckGreen} from '@assets/adherence/round_check_green.svg'
import Loader from '@components/widgets/Loader'
import CommentIcon from '@mui/icons-material/Comment'
import {Box, Checkbox, styled} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {latoFont} from '@style/theme'
import moment from 'moment'
import React, {FunctionComponent} from 'react'

type AdherenceAlertsProps = {
  studyId?: string
}

type AlertType = 'enrollment' | 'adherence' | 'upcoming'

type AdhAlert = {
  type: AlertType
  participantId: string
  timestamp: Date
  text: string
  done?: boolean
}
const _alerts: AdhAlert[] = [
  {
    type: 'adherence',
    participantId: '323132',
    timestamp: new Date(),
    text: 'has adherence below 60%.',
  },
  {
    type: 'upcoming',
    participantId: '3231349',
    timestamp: new Date(),
    text: 'has and upcoming Burst in two weeks',
  },

  {
    type: 'adherence',
    timestamp: new Date(),
    participantId: '3231321',
    text: 'has adherence below 60%.',
  },
  {
    type: 'upcoming',
    participantId: '3231340',
    timestamp: new Date(),
    text: 'has and upcoming Burst in two weeks',
  },
  {
    type: 'enrollment',
    participantId: '32311432',
    timestamp: new Date(),
    text: 'has enrolled',
  },
]

const UlStyled = styled('ul')(({theme}) => ({
  listStyleType: 'none',
  width: '100%',
  margin: '0',
  padding: theme.spacing(3),
  borderTop: '1px solid #CFCFCF',
  '&> li': {
    display: 'flex',
    alignItems: 'center',
    fontFamily: latoFont,
    padding: theme.spacing(2, 1, 2, 1),
    borderBottom: '1px solid #CFCFCF',
  },
  '& .MuiCheckbox-root:hover': {
    backgroundColor: 'transparent',
  },
  '& div:nth-of-type(1)': {
    marginRight: theme.spacing(3),
  },
  '& div:nth-of-type(2)': {
    flexGrow: 1,
  },
  '& div:nth-of-type(3)': {
    position: 'relative',
    width: '90px',

    textAlign: 'right',

    '& i': {
      position: 'absolute',
      right: '8px',
      top: '-24px',
      fontFamily: latoFont,
      fontSize: '12px',
      fontStyle: 'italic',
      fontWeight: 400,
    },
  },
}))
const DateSpan = styled('span')(({theme}) => ({
  display: 'block',
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '14px',
  color: 'rgba(40, 40, 40, 0.8)',
}))
const TextSpan = styled('span')(({theme}) => ({
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '19px',
  color: '#393434',
}))

const TypeIcons = new Map<AlertType, React.ReactNode>([
  ['enrollment', <PersonIcon />],
  ['adherence', <AdherenceRed />],
  ['upcoming', <CalendarBlue />],
])

const AdherenceAlerts: FunctionComponent<AdherenceAlertsProps> = () => {
  const [alerts, setAlerts] = React.useState<AdhAlert[] | undefined>(_alerts)
  const [checked, setChecked] = React.useState([0])

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <Loader reqStatusLoading={!alerts}>
      {alerts && (
        <Box>
          <Box>
            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
              {[0, 1, 2, 3].map(value => {
                const labelId = `checkbox-list-label-${value}`

                return (
                  <ListItem
                    key={value}
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments">
                        <CommentIcon />
                      </IconButton>
                    }
                    disablePadding>
                    <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{'aria-labelledby': labelId}}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>
          <UlStyled>
            {alerts.map((alert, index) => (
              <li key={index}>
                <div>{TypeIcons.get(alert.type)}</div>
                <div>
                  <DateSpan>{moment(alert.timestamp).format('MMM Do, YYYY @ h:mm:ss a')}</DateSpan>

                  <TextSpan>{alert.text}</TextSpan>
                </div>
                <div>
                  {index === 0 && <i>Mark to Resolve</i>}
                  <Checkbox
                    icon={<CheckEmpty />}
                    checkedIcon={<CheckGreen />}
                    checked={alert.done || false}
                    onChange={e => {
                      setAlerts(prev => prev?.map((a, i) => (index === i ? {...alert, done: e.target.checked} : a)))
                    }}
                  />
                </div>
              </li>
            ))}
          </UlStyled>
        </Box>
      )}
    </Loader>
  )
}

export default AdherenceAlerts
