import {
  Box,
  Button,
  Container,
  Divider,
  makeStyles,
  Menu,
  MenuItem
} from '@material-ui/core'
import Link from '@material-ui/core/Link'
import React, { FunctionComponent, useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../helpers/AuthContext'
import { useStudyInfoDataDispatch } from '../../helpers/StudyInfoContext'
import { generateNonambiguousCode } from '../../helpers/utility'
import StudyService from '../../services/study.service'
import constants from '../../types/constants'
import { Study, StudyPhase } from '../../types/types'
import ConfirmationDialog from '../widgets/ConfirmationDialog'
import { MTBHeading } from '../widgets/Headings'
import Loader from '../widgets/Loader'
import StudyCard from './StudyCard'

type StudyListOwnProps = {}

type SectionStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED'

type StudySublistProps = {
  status: SectionStatus
  studies: Study[]
  onAction: Function
  renameStudyId: string
  highlightedStudyId: string | null
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
    margin: theme.spacing(5, 2, 3),
    width: '160px',
    height: '49px',
    backgroundColor: '#3A3A3A',
    color: 'white',
    '&:hover': {
      transform: 'translateY(1px)',
      backgroundColor: '#3A3A3A',
    },
    fontFamily: 'Lato',
  },
}))

const sections = [
  {
    studyStatus: ['design'] as StudyPhase[],
    title: 'Draft Studies',
    filterTitle: 'Design',
    sectionStatus: 'DRAFT' as SectionStatus
  },
  {
    studyStatus: ['recruitment', 'in_flight'] as StudyPhase[],
    title: 'Live Studies',
    filterTitle: 'Live',
    sectionStatus: 'LIVE' as SectionStatus
  },
  {
    studyStatus: ['completed', 'withdrawn', 'analysis', 'legacy'] as StudyPhase[],
    title: 'Completed Studies',
    filterTitle: 'Completed',
    sectionStatus: 'COMPLETED' as SectionStatus
  },
]

type StudyListProps = StudyListOwnProps & RouteComponentProps

const StudySublist: FunctionComponent<StudySublistProps> = ({
  studies,
  status,

  renameStudyId,
  onAction,
  highlightedStudyId,
}: StudySublistProps) => {
  const classes = useStyles()
  const item = sections.find(section => section.sectionStatus === status)!
  const displayStudies = studies.filter(study => item.studyStatus.includes(study.phase))
  const studyLink =
    item.sectionStatus === 'DRAFT'
      ? `/studies/builder/:id/session-creator`
      : `/studies/:id/participant-manager`

  if (!displayStudies.length) {
    return <></>
  }

  const sortStudies = (a: Study, b: Study, sortBy: String): number => {
    const dateA = sortBy === 'CREATION' ? a.createdOn! : a.modifiedOn!
    const dateB = sortBy === 'CREATION' ? b.createdOn! : b.modifiedOn!
    return dateA >= dateB ? -1 : 1
  }

  if (status === 'DRAFT') {
    // _.orderBy(displayStudies, ['modifiedOn'], 'desc')
    displayStudies.sort((a, b) => sortStudies(a, b, 'LAST_EDIT'))
  } else {
    // _.orderBy(displayStudies, ['createdOn'], 'desc')
    displayStudies.sort((a, b) => sortStudies(a, b, 'CREATION'))
  }
  return (
    <>
      <MTBHeading variant={'h2'} align={'left'}>
        {' '}
        {item.title}
      </MTBHeading>
      <Box className={classes.cardGrid}>
        {displayStudies.map((study, index) => (
          <Link
            style={{ textDecoration: 'none' }}
            key={study.identifier || index}
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
              isNewlyAddedStudy={highlightedStudyId === study.identifier}
            ></StudyCard>
          </Link>
        ))}
      </Box>
    </>
  )
}

const StudyList: FunctionComponent<StudyListProps> = () => {
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  const handleError = useErrorHandler()

  const { token } = useUserSessionDataState()
  const [menuAnchor, setMenuAnchor] = React.useState<null | {
    study: Study
    anchorEl: HTMLElement
  }>(null)
  const [renameStudyId, setRenameStudyId] = React.useState('')
  const classes = useStyles()
  const handleMenuClose = () => {
    setMenuAnchor(null)
  }
  const closeConfirmationDialog = () => {
    setIsConfirmDeleteOpen(false)
    setMenuAnchor(null)
  }
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const [statusFilters, setStatusFilters] = React.useState<SectionStatus[]>(
    sections.map(section => section.sectionStatus),
  )
  const [highlightedStudyId, setHighlightedStudyId] = React.useState<
    string | null
  >(null)

  let resetNewlyAddedStudyID: NodeJS.Timeout

  const { data: studies, status, error, run, setData: setStudies } = useAsync<
    Study[]
  >({
    status: 'PENDING',
    data: [],
  })

  const resetStatusFilters = () =>
    setStatusFilters(sections.map(section => section.sectionStatus))

  const createStudy = async (study?: Study) => {
    //if study is provided -- we are duplicating
    const id = generateNonambiguousCode(6)

    const newStudy: Study = study
      ? {
          ...study!,
          identifier: id,
          version: 1,
          name: `Copy of ${study!.name}`,
          phase: 'design' as StudyPhase,
          createdOn: new Date(),
          modifiedOn: new Date(),
        }
      : {
          identifier: id,
          version: 1,
          clientData: {},
          phase: 'design' as StudyPhase,
          name: constants.constants.NEW_STUDY_NAME,
          createdOn: new Date(),
          modifiedOn: new Date(),
        }

    if (study) {
      //if we are duplicating
      const studyFromServer = await StudyService.getStudy(
        study.identifier,
        token!,
      )
      if (studyFromServer?.scheduleGuid) {
        // need to duplicate the schedule
        const schedule = await StudyService.getStudySchedule(
          studyFromServer?.scheduleGuid,
          token!
        )
        //@ts-ignore
        schedule!.guid = undefined
        const sched = await StudyService.createNewStudySchedule(
          schedule!,
          token!,
        )
        newStudy.scheduleGuid = sched.guid
        studyDataUpdateFn({
          type: 'SET_SCHEDULE',
          payload: { study: newStudy, schedule: sched },
        })
      }
    }

    const version = await StudyService.createStudy(newStudy, token!)
    newStudy.version = version
    studyDataUpdateFn({
      type: 'SET_STUDY',
      payload: { study: newStudy },
    })

    //setStudies([...studies|| [], newStudy])
    if (study) {
      setHighlightedStudyId(id)
      resetNewlyAddedStudyID = setTimeout(() => {
        setHighlightedStudyId(null)
      }, 2000)
    } else {
      if (newStudy) {
        studyDataUpdateFn({
          type: 'SET_STUDY',
          payload: { study: newStudy },
        })
        window.location.replace(
          `${window.location.origin}/studies/builder/${id}/session-creator`,
        )
      } else {
        handleError(new Error('Study was not created'))
      }
    }
  }

  const onAction = async (study: Study, type: StudyAction) => {
    if (!token) {
      return
    }
    handleMenuClose()
    let result
    switch (type) {
      case 'RENAME':
        const singleStudy = await StudyService.getStudy(
          study?.identifier,
          token,
        )
        const newVersion = await StudyService.updateStudy(
          { ...singleStudy!, name: study.name },
          token,
        )
        setStudies(
          studies!.map(s =>
            s.identifier !== study.identifier
              ? s
              : { ...study, version: newVersion },
          ),
        )

        setRenameStudyId('')

        return

      case 'DELETE':
        result = await StudyService.removeStudy(study.identifier, token)
        setStudies(result)
        return

      case 'DUPLICATE':
        createStudy(study)
        return
      default: {
      }
    }
  }

  const isSelectedFilter = (filter: SectionStatus) =>
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
  }, [token, highlightedStudyId])

  if (!studies && status === 'RESOLVED') {
    return (
      <div>
        {' '}
        {status}
        You currently have no studies created. To begin, please click on Create
        New Study.
      </div>
    )
  }
  return (
    <Loader reqStatusLoading={status === 'PENDING' || !studies} variant="full">
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
                  fontFamily: 'Poppins',
                }}
              >
                All
              </Button>
            </li>
            {sections.map(section => (
              <li className={classes.filterItem} key={section.sectionStatus}>
                <Button
                  onClick={() => setStatusFilters([section.sectionStatus])}
                  style={{
                    color: 'inherit',
                    fontWeight: isSelectedFilter(section.sectionStatus)
                      ? 'bolder'
                      : 'normal',
                    fontFamily: 'Poppins',
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
            + Create New Study
          </Button>
        </Box>
        <Divider className={classes.divider}></Divider>

        {studies!.length > 0 &&
          statusFilters.map((status, index) => (
            <Box
              style={{ paddingBottom: index < 2 ? '24px' : '0' }}
              key={status}
            >
              <StudySublist
                studies={studies!}
                renameStudyId={renameStudyId}
                status={status}
                onAction={(s: Study, action: StudyAction, e: any) => {
                  action === 'ANCHOR'
                    ? setMenuAnchor({ study: s, anchorEl: e })
                    : onAction(s, action)
                }}
                highlightedStudyId={highlightedStudyId}
              />
            </Box>
          ))}

        <Menu
          id="study-menu"
          anchorEl={menuAnchor?.anchorEl}
          keepMounted
          open={Boolean(menuAnchor?.anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>View</MenuItem>
          {menuAnchor?.study.phase === 'design' && (
            <MenuItem
              onClick={() => {
                setRenameStudyId(menuAnchor?.study.identifier)
                handleMenuClose()
              }}
            >
              Rename
            </MenuItem>
          )}

          <MenuItem onClick={() => onAction(menuAnchor!.study, 'DUPLICATE')}>
            Duplicate
          </MenuItem>

          <MenuItem onClick={() => setIsConfirmDeleteOpen(true)}>
            Delete
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
    </Loader>
  )
}

export default StudyList
