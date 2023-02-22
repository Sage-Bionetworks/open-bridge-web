import {useAdherenceAlerts, useUpdateAdherenceAlerts} from '@components/studies/adherenceHooks'
import Loader from '@components/widgets/Loader'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import TablePagination from '@components/widgets/pagination/TablePagination'
import {
  Badge,
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
import {DateRange, PersonAddAlt, TrendingDown} from '@mui/icons-material'
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

const BoxForFilters = styled(Box)(({theme}) => ({
  padding: theme.spacing(1, 2),
  display: 'flex',
  mt: 0,
  mb: 1,
  background: '#F1F3F5',
}))

const ALERTS = {
  new_enrollment: {
    label: 'New Enrollment',
    icon: <PersonAddAlt />,
    text: 'has newly enrolled.',
  },
  low_adherence: {
    label: 'Adherence',
    icon: <TrendingDown />,
    text: 'has adherence below [threshold]%.',
  },
  upcoming_study_burst: {
    label: 'Upcoming Test Cycle',
    icon: <DateRange />,
    text: 'has an upcoming burst.',
  },
  study_burst_change: {
    label: 'Test Window Changes',
    icon: <PublishedWithChangesRoundedIcon />,
    text: 'is owed $32.',
  },
  timeline_accessed: {
    label: 'Timeline Retrieved',
    icon: <PersonPinCircleOutlinedIcon />,
    text: 'has logged in for the first time.',
  },
}

const AlertIconWithYellowDot: FunctionComponent = () => {
  return (
    <Badge
      sx={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: theme.spacing(1),
        '& .MuiBadge-badge': {
          backgroundColor: '#FFA825',
        },
      }}
      color="warning"
      overlap="circular"
      variant="dot">
      <NotificationsNoneTwoToneIcon
        sx={{
          fontSize: theme.typography.h3.fontSize,
          color: '#878E95',
        }}
      />
    </Badge>
  )
}

const IconWithRoundBackground: FunctionComponent<{icon: ReactElement | undefined; isRead: boolean}> = ({
  icon,
  isRead,
}) => {
  return (
    <Box sx={{display: 'inline-block', padding: theme.spacing(1), paddingRight: theme.spacing(5)}}>
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
  const alertSentence = ALERTS[alert.category].text

  return (
    <Box sx={{display: 'inline-block'}}>
      <AlertDateText>
        {`${ALERTS[alert.category].label.toUpperCase()} | 
        ${dayjs(alert.createdOn).format('M/D/YYYY @ h:mm a')}`}
      </AlertDateText>
      <AlertSentenceText sx={{fontWeight: alert.read ? 400 : 700}}>
        Participant&nbsp;
        <StyledLink to={`adherence/${alert.participant?.identifier || 'nothing'}`}>
          {ParticipantService.formatExternalId(studyId, alert.participant.externalId)}
        </StyledLink>
        &nbsp;
        {alert.category === 'low_adherence'
          ? alertSentence.replace('[threshold]', alert.data!.adherenceThreshold)
          : alertSentence}
      </AlertSentenceText>
    </Box>
  )
}

const AlertMenu: FunctionComponent<{
  alert: AdherenceAlert
  studyId: string
  checked: AdherenceAlertCategory[]
  currentPage: number
  pageSize: number
}> = ({alert, studyId, checked, currentPage, pageSize}) => {
  // menu - https://mui.com/material-ui/react-menu/#basic-menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // confirmation diaglog
  const [isConfirmDialogOpen, setIsConfirmationDialogOpen] = React.useState<'DELETE' | undefined>(undefined)

  const closeConfirmationDialog = () => {
    setIsConfirmationDialogOpen(undefined)
  }

  // update alerts state
  const [error, setError] = React.useState<Error>()
  const {isLoading, error: alertUpdateError, mutateAsync} = useUpdateAdherenceAlerts()
  React.useEffect(() => {
    if (alertUpdateError) setError(alertUpdateError as Error)
  }, [alertUpdateError])

  const onUpdateAdherenceAlert = async (action: 'READ' | 'UNREAD' | 'DELETE') => {
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
          key={alert.read ? 'unread' : 'read'}
          onClick={() => {
            handleClose()
            // mark unread if currently read, or vice-versa
            alert.read ? onUpdateAdherenceAlert('UNREAD') : onUpdateAdherenceAlert('READ')
          }}>
          {`Mark as ${alert.read ? 'Unread' : 'Read'}`}
        </MenuItem>
        <MenuItem
          key="delete"
          onClick={() => {
            handleClose()
            setIsConfirmationDialogOpen('DELETE')
          }}>
          Resolve
        </MenuItem>
      </Menu>
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen === 'DELETE'}
        title={'Are you sure you want to resolve this alert?'}
        type={'DELETE'}
        actionText={'Resolve Alert'}
        onCancel={closeConfirmationDialog}
        onConfirm={() => {
          closeConfirmationDialog()
          onUpdateAdherenceAlert('DELETE')
        }}>
        <div>
          <p>
            Marking this alert as resolved will remove the alert from this list.&nbsp;
            <strong>
              <i>This action can not be undone.</i>
            </strong>
          </p>
        </div>
      </ConfirmationDialog>
    </Box>
  )
}

const AdherenceAlerts: FunctionComponent<AdherenceAlertsProps> = ({studyId}) => {
  // set hooks
  // ...checkboxes
  const [checked, setChecked] = React.useState(Object.keys(ALERTS) as AdherenceAlertCategory[])

  // ...table
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(50)

  // fetch data
  const {data, error, isLoading} = useAdherenceAlerts(studyId, checked, pageSize, currentPage)

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
        <AlertIconWithYellowDot />
        Alerts
      </Typography>
      <BoxForFilters>
        {Object.keys(ALERTS).map(category => (
          <FormGroup key={category}>
            <FormControlLabel
              value={category}
              control={
                <Checkbox
                  checked={checked.indexOf(category as AdherenceAlertCategory) !== -1}
                  onChange={handleToggle(category as AdherenceAlertCategory)}
                  // handle case alerts endpoint returns all alerts
                  // ...when no categories are selected
                  disabled={checked.length === 1 && category === checked[0]}
                />
              }
              label={ALERTS[category as AdherenceAlertCategory].label}
              labelPlacement="end"
            />
          </FormGroup>
        ))}
      </BoxForFilters>
      <Table>
        <TableBody>
          {data !== undefined &&
            data.items
              /* .sort((a, b) => {
                if (a.read && !b.read) return 1
                if (b.read && !a.read) return -1
                if (dayjs(a.createdOn) < dayjs(b.createdOn)) return 1
                if (dayjs(a.createdOn) > dayjs(b.createdOn)) return -1
                return 0
              }) */
              .map((alert, index) => (
                <TableRow key={index}>
                  <BorderedTableCell
                    $isDark={index % 2 === 1}
                    sx={{
                      padding: theme.spacing(0.5),
                      borderLeft: 'none',
                      borderTop: '1px solid #EAECEE',
                      borderBottom: '1px solid #EAECEE',
                    }}>
                    <IconWithRoundBackground icon={ALERTS[alert.category].icon} isRead={alert.read} />
                    <AlertText alert={alert} studyId={studyId} />
                    <AlertMenu
                      alert={alert}
                      studyId={studyId}
                      checked={checked}
                      currentPage={currentPage}
                      pageSize={pageSize}
                    />
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
        counterTextSingular="alerts"
      />
    </Loader>
  )
}

export default AdherenceAlerts
