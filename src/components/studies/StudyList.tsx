import {
  Box,
  Button,
  Container,
  Divider,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core'
import Link from '@material-ui/core/Link'
import React, { FunctionComponent, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useSessionDataState } from '../../helpers/AuthContext'
import { getRandomId } from '../../helpers/utility'
import StudyService from '../../services/study.service'
import { Study, StudyStatus } from '../../types/types'
import ConfirmationDialog from '../widgets/ConfirmationDialog'
import { MTBHeading } from '../widgets/Headings'
import StudyCard from './StudyCard'

type StudyListOwnProps = {}

type StudySublistProps = {
  status: StudyStatus
  studies: Study[]
  onAction: Function
  renameStudyId: string
}

type StudyAction = 'DELETE' | 'ANCHOR' | 'DUPLICATE' | 'RENAME'

const studyCardWidth = '290'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  studyContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '600px',
    },
  },

  cardGrid: {
    //const cardWidth = 300
    display: 'grid',
    padding: theme.spacing(0),
    gridTemplateColumns: `repeat(auto-fill,${studyCardWidth}px)`,
    gridColumnGap: theme.spacing(2),
    gridRowGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      justifyContent: 'center',
      gridRowGap: theme.spacing(4),
    },
  },
  divider: {
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(5)}px 0`,
  },

  filters: {
    listStyle: 'none',
    alignSelf: 'flex-end',
    margin: '0',
    paddingLeft: 0,
  },

  filterItem: {
    display: 'inline-block',
  },

  createStudyButton: {
    margin: `${theme.spacing(5)}px ${theme.spacing(2)}px ${theme.spacing(3)}px`,
    width: '160px',
    height: '49px',
    backgroundColor: '#3A3A3A',
    color: 'white',
    '&:hover': {
      transform: 'translateY(1px)',
      backgroundColor: '#3A3A3A',
    },
    textTransform: 'none',
  },
}))

const sections = [
  {
    status: 'DRAFT' as StudyStatus,
    title: 'Draft Studies',
    filterTitle: 'Draft',
  },
  {
    status: 'ACTIVE' as StudyStatus,
    title: 'Live Studies',
    filterTitle: 'Live',
  },
  {
    status: 'COMPLETED' as StudyStatus,
    title: 'Completed Studies',
    filterTitle: 'Completed',
  },
]

type StudyListProps = StudyListOwnProps & RouteComponentProps

const StudySublist: FunctionComponent<StudySublistProps> = ({
  studies,
  status,
  //onSetAnchor,
  renameStudyId,
  onAction,
}: StudySublistProps) => {
  const classes = useStyles()
  const item = sections.find(section => section.status === status)!
  const displayStudies = studies.filter(study => study.status === status)
  const studyLink =
    status === 'DRAFT'
      ? `/studies/builder/:id/session-creator`
      : `/studies/:id/participant-manager`

  if (!displayStudies.length) {
    return <></>
  }
  return (
    <>
      <MTBHeading variant={'h2'} align={'left'}>
        {' '}
        {item.title}
      </MTBHeading>

      <Box className={classes.cardGrid}>
        {displayStudies.map(study => (
          <Link
            style={{ textDecoration: 'none' }}
            key={study.identifier}
            variant="body2"
            href={studyLink.replace(':id', study.identifier)}
          >
            <StudyCard
              study={study}
              onRename={(newName: string) => {
                onAction({ ...study, name: newName }, 'RENAME')
              }}
              isRename={renameStudyId === study.identifier}
              onSetAnchor={(e: HTMLElement) => {
                onAction(study, 'ANCHOR', e)
              }}
            ></StudyCard>
          </Link>
        ))}
      </Box>
    </>
  )
}

const StudyList: FunctionComponent<StudyListProps> = () => {
  const { token } = useSessionDataState()
  const [studies, setStudies] = React.useState<Study[]>([])
  const [menuAnchor, setMenuAnchor] = React.useState<null | {
    study: Study
    anchorEl: HTMLElement
  }>(null)
  const [renameStudyId, setRenameStudyId] = React.useState('')
  const classes = useStyles()
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleMenuClose = () => {
    setMenuAnchor(null)
  }
  const closeConfirmationDialog = () => {
    setIsConfirmDeleteOpen(false)
    setMenuAnchor(null)
  }
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const [statusFilters, setStatusFilters] = React.useState<StudyStatus[]>(
    sections.map(section => section.status),
  )

  const resetStatusFilters = () =>
    setStatusFilters(sections.map(section => section.status))

  const createStudy = async () => {
    const newStudy: Study = {
      identifier: getRandomId(),
      status: 'DRAFT' as StudyStatus,
      name: 'Untitled Study',
    }
    setStudies([...studies, newStudy])
    const x = await StudyService.saveStudy(newStudy, token!)
    setStudies(x)
  }

  const onAction = async (study: Study, type: StudyAction) => {
    if (!token) {
      return
    }
    handleMenuClose()
    let result
    switch (type) {
      case 'RENAME':
        setStudies(
          studies.map(s => (s.identifier !== study.identifier ? s : study)),
        )
        console.log('studies', studies)
        result = await StudyService.saveStudy(study, token)
        setStudies(result)
        setRenameStudyId('')
        return

      case 'DELETE':
        const s = await StudyService.removeStudy(study.identifier, token)
        console.log(studies.length)
        console.log(s.length)
        setStudies(s)
        return

      case 'DUPLICATE':
        //const study = studies.find(s => s.identifier === tudy.identifier)
        const newStudy = {
          ...study!,
          identifier: getRandomId(),
          name: `Copy of ${study!.name}`,
        }
        setStudies([...studies, newStudy])
        result = await StudyService.saveStudy(newStudy, token)
        setStudies(result)
        return
      default: {
      }
    }
  }

  const isSelectedFilter = (filter: StudyStatus) =>
    statusFilters.indexOf(filter) > -1 && statusFilters.length === 1

  useEffect(() => {
    let isSubscribed = true
    const getInfo = async () => {
      if (isSubscribed) {
        try {
          //setIsLoading(true)

          const studies = await StudyService.getStudies(token!)

          if (isSubscribed) {
            setStudies(studies)
          }
        } catch (e) {
          // isSubscribed && setError(e)
        } finally {
          // isSubscribed && setIsLoading(false)
        }
      }
    }

    getInfo()

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <Container maxWidth="lg" className={classes.studyContainer}>
      <Box display="flex" justifyContent="space-between">
        <ul className={classes.filters} aria-label="filters">
          <li className={classes.filterItem}>View by:</li>
          <li className={classes.filterItem}>
            <Button
              onClick={resetStatusFilters}
              style={{
                color: 'inherit',
                fontWeight: statusFilters.length > 1 ? 'bolder' : 'normal',
              }}
            >
              All
            </Button>
          </li>
          {sections.map(section => (
            <li className={classes.filterItem} key={section.status}>
              <Button
                onClick={() => setStatusFilters([section.status])}
                style={{
                  color: 'inherit',
                  fontWeight: isSelectedFilter(section.status)
                    ? 'bolder'
                    : 'normal',
                }}
              >
                {section.filterTitle}
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="contained"
          onClick={() => createStudy()}
          className={classes.createStudyButton}
        >
          + Create a Study
        </Button>
      </Box>
      <Divider className={classes.divider}></Divider>
      {studies?.length === 0 && (
        <div>
          You currently have no studies created. To begin, please click on
          Create New Study.
        </div>
      )}
      {studies.length > 0 &&
        statusFilters.map((status, index) => (
          <Box style={{ paddingBottom: index < 2 ? '24px' : '0' }} key={status}>
            <StudySublist
              studies={studies}
              renameStudyId={renameStudyId}
              status={status}
              onAction={(s: Study, action: StudyAction, e: any) => {
                action === 'ANCHOR'
                  ? setMenuAnchor({ study: s, anchorEl: e })
                  : onAction(s, action)
              }}
            />
            {/*index < 2 && <Divider className={classes.divider}></Divider>*/}
          </Box>
        ))}

      <Menu
        id="simple-menu"
        anchorEl={menuAnchor?.anchorEl}
        keepMounted
        open={Boolean(menuAnchor?.anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View</MenuItem>
        {menuAnchor?.study.status === 'DRAFT' && (
          <MenuItem
            onClick={() => {
              setRenameStudyId(menuAnchor?.study.identifier)
              handleMenuClose()
            }}
          >
            Rename study
          </MenuItem>
        )}

        <MenuItem onClick={() => onAction(menuAnchor!.study, 'DUPLICATE')}>
          Duplicate study
        </MenuItem>

        <MenuItem onClick={() => setIsConfirmDeleteOpen(true)}>
          Delete study
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        title={'Delete Study'}
        type={'DELETE'}
        onCancel={closeConfirmationDialog}
        onConfirm={() => {
          closeConfirmationDialog()
          onAction(menuAnchor!.study, 'DELETE')
        }}
      >
        <div>
          Are you sure you would like to permanently delete:{' '}
          <p>{menuAnchor?.study.name}</p>
        </div>
      </ConfirmationDialog>
    </Container>
  )
}

export default StudyList
