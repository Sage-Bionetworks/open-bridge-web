import {useAdherenceAlerts, useUpdateAdherenceAlerts} from '@components/studies/adherenceHooks'
import Loader from '@components/widgets/Loader'
import TablePagination from '@components/widgets/pagination/TablePagination'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Table,
  TableRow,
  TableBody,
  IconButton,
  Typography,
  Avatar,
  styled,
} from '@mui/material'
import React, {FunctionComponent, ReactElement} from 'react'
import {AdherenceAlert, AdherenceAlertCategory} from '@typedefs/types'
import {theme} from '@style/theme'
import dayjs from 'dayjs'
import {BorderedTableCell, StyledLink} from '../../widgets/StyledComponents'
import {DateRange, PersonAddAlt, QuestionMark, TrendingDown} from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone'
import ParticipantService from '@services/participants.service'
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded'
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined'

type AdherenceAlertsProps = {
  studyId: string
}

const CheckboxBox = styled(Box)(({theme}) => ({
  padding: theme.spacing(1, 2),
  display: 'flex',
  mt: 0,
  mb: 1,
  background: '#F1F3F5',
}))

const ALERT_CATEGORY: {label: string; value: AdherenceAlertCategory}[] = [
  {label: 'New Enrollment', value: 'new_enrollment'},
  {label: 'Adherence', value: 'low_adherence'},
  {label: 'Upcoming Test Cycle', value: 'upcoming_study_burst'},
  {label: 'Test Window Changes', value: 'study_burst_change'},
  {label: 'Timeline Retrieved', value: 'timeline_accessed'},
]

const alertCategoryToLabel = (value: AdherenceAlertCategory) => {
  return ALERT_CATEGORY.find(pair => pair.value === value)?.label
}

const alertCategoryToText = (category: AdherenceAlertCategory, data: string) => {
  switch (category) {
    case 'new_enrollment':
      return 'has newly enrolled.'
    case 'timeline_accessed':
      return 'has logged in for the first time.'
    case 'low_adherence':
      return `has adherence below ${JSON.parse(data).adherenceThreshold}`
    case 'upcoming_study_burst':
      return 'has an upcoming burst.'
    case 'study_burst_change':
      return 'is owed $32.'
  }
}

const AlertIcons = new Map<AdherenceAlertCategory, ReactElement>([
  ['new_enrollment', <PersonAddAlt />],
  ['timeline_accessed', <PersonPinCircleOutlinedIcon />],
  ['low_adherence', <TrendingDown />],
  ['upcoming_study_burst', <DateRange />],
  ['study_burst_change', <PublishedWithChangesRoundedIcon />],
])

const IconWithRoundBackground: FunctionComponent<{icon: ReactElement | undefined; isRead: boolean}> = ({
  icon,
  isRead,
}) => {
  return (
    <Box sx={{display: 'inline-block', padding: theme.spacing(1)}}>
      <Avatar
        sx={{
          backgroundColor: isRead ? '#F1F3F5' : '#FFA82526',
          color: isRead ? '#878E95' : '#FFA825',
        }}>
        {icon}
      </Avatar>
    </Box>
  )
}

const AlertDateText = styled(Typography)(({theme}) => ({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '18px',
  color: '#878E95',
}))

const AlertSentenceText = styled(Typography)(({theme}) => ({
  display: 'inline-block',
  fontSize: '16px',
  lineHeight: '20px',
  color: '#353A3F',
}))

const AlertText: FunctionComponent<{alert: AdherenceAlert; studyId: string}> = ({alert, studyId}) => {
  return (
    <Box sx={{display: 'inline-block'}}>
      <AlertDateText>
        {`${alertCategoryToLabel(alert.category)?.toUpperCase()} | 
        ${dayjs(alert.createdOn).format('M/D/YYYY @ h:mm a')}`}
      </AlertDateText>
      <AlertSentenceText sx={{fontWeight: alert.read ? 400 : 700}}>
        Participant&nbsp;
        <StyledLink to={`adherence/${alert.participant?.identifier || 'nothing'}`}>
          {ParticipantService.formatExternalId(studyId, alert.participant.externalId)}
        </StyledLink>
        &nbsp;{alertCategoryToText(alert.category, alert.data)}
      </AlertSentenceText>
    </Box>
  )
}

const AlertMenu: FunctionComponent<{
  alert: AdherenceAlert
  studyId: string
}> = ({alert, studyId}) => {
  // menu - https://mui.com/material-ui/react-menu/#basic-menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // update alerts state
  const [error, setError] = React.useState<Error>()
  const {isLoading, error: alertUpdateError, mutateAsync} = useUpdateAdherenceAlerts()
  React.useEffect(() => {
    if (alertUpdateError) setError(alertUpdateError as Error)
  }, [alertUpdateError])

  const onUpdateAlert = async (action: 'READ' | 'UNREAD' | 'DELETE') => {
    mutateAsync({
      studyId: studyId,
      alertIds: [alert.id],
      action: action,
    })
  }

  return (
    <Box sx={{display: 'inline-block', float: 'right'}}>
      <IconButton
        aria-label="more"
        id="adherence-alert-status-button"
        aria-controls={open ? 'adherence-alert-status-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="adherence-alert-status-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'adherence-alert-status-button',
        }}>
        <MenuItem
          onClick={() => {
            handleClose()
            // mark unread if currently read, or vice-versa
            alert.read ? onUpdateAlert('UNREAD') : onUpdateAlert('READ')
          }}>
          {`Mark as ${alert.read ? 'Unread' : 'Read'}`}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()
            // onUpdateAlert('DELETE')
          }}>
          Resolve
        </MenuItem>
      </Menu>
    </Box>
  )
}

const AdherenceAlerts: FunctionComponent<AdherenceAlertsProps> = ({studyId}) => {
  // set hooks
  // ...checkboxes
  const [checked, setChecked] = React.useState(ALERT_CATEGORY.map(a => a.value))

  // ...table
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(50)

  // fetch data
  const offset = currentPage * pageSize
  const {data, error, isLoading} = useAdherenceAlerts(studyId, checked, pageSize, offset)

  // update checked boxes
  const handleToggle = (value: AdherenceAlertCategory) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setCurrentPage(0)
    setChecked(newChecked)
  }

  return (
    <Loader reqStatusLoading={isLoading}>
      <Typography variant="h3">
        <NotificationsNoneTwoToneIcon fontSize="large" style={{verticalAlign: 'middle'}} /> Alerts
      </Typography>
      <CheckboxBox>
        {ALERT_CATEGORY.map((item, index) => (
          <FormGroup key={item.value}>
            <FormControlLabel
              value={item.value}
              control={
                <Checkbox
                  checked={checked.indexOf(item.value) !== -1}
                  onChange={handleToggle(item.value)}
                  // handle case alerts endpoint returns all alerts
                  // ...when no categories are selected
                  disabled={checked.length === 1 && item.value === checked[0]}
                />
              }
              label={item.label}
              labelPlacement="end"
            />
          </FormGroup>
        ))}
      </CheckboxBox>
      <Table>
        <TableBody>
          {data !== undefined &&
            data.items.map((alert, index) => (
              <TableRow key={index}>
                <BorderedTableCell>
                  <IconWithRoundBackground icon={AlertIcons.get(alert.category)} isRead={alert.read} />
                  <AlertText alert={alert} studyId={studyId} />
                  <AlertMenu alert={alert} studyId={studyId} />
                </BorderedTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        totalItems={typeof data === 'undefined' ? 0 : data!.total}
        onPageSelectedChanged={(pageSelected: number) => {
          setCurrentPage(pageSelected)
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        counterTextSingular="participant"
      />
    </Loader>
  )
}

export default AdherenceAlerts
