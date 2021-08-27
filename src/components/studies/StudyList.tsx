import {useStudies, useUpdateStudy} from '@helpers/hooks'
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
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {RouteComponentProps} from 'react-router-dom'
import {useUserSessionDataState} from '../../helpers/AuthContext'
import {useStudyInfoDataDispatch} from '../../helpers/StudyInfoContext'
import Utility from '../../helpers/utility'
import StudyService from '../../services/study.service'
import {latoFont} from '../../style/theme'
import constants from '../../types/constants'
import {
  AdminRole,
  DisplayStudyPhase,
  Study,
  StudyPhase,
} from '../../types/types'
import ConfirmationDialog from '../widgets/ConfirmationDialog'
import {MTBHeading} from '../widgets/Headings'
import Loader from '../widgets/Loader'
import StudyCard from './StudyCard'

type StudyListOwnProps = {}

type StudySublistProps = {
  status: DisplayStudyPhase
  userRoles: AdminRole[]
  studies: Study[]
  onAction: Function
  renameStudyId: string
  highlightedStudyId: string | null
  menuAnchor: {
    study: Study
    anchorEl: HTMLElement
  } | null
}

type StudyAction = 'DELETE' | 'ANCHOR' | 'DUPLICATE' | 'RENAME'

const studyCardWidth = '290'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F3EFE5',
    height: '100%',
    minHeight: 'calc(100vh - 104px)',
    [theme.breakpoints.down('md')]: {
      minHeight: '100vh',
    },
  },
  studyContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '600px',
    },
    height: '100%',
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
  list: {
    fontFamily: latoFont,
    fontSize: '14px',
    lineHeight: '17px',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  paper: {
    marginLeft: theme.spacing(3.5),
    borderRadius: '0px',
    '& li': {
      padding: theme.spacing(1.25, 2, 1.25, 2),
    },
    boxShadow: '2px 1.5px 2px 1px rgba(0, 0, 0, 0.15)',
  },
}))

const sections = [
  {
    studyStatus: ['design'] as StudyPhase[],
    title: 'Draft Studies',
    filterTitle: 'Design',
    sectionStatus: 'DRAFT' as DisplayStudyPhase,
  },
  {
    studyStatus: ['in_flight', 'recruitment'] as StudyPhase[],
    title: 'Live Studies',
    filterTitle: 'Live',
    sectionStatus: 'LIVE' as DisplayStudyPhase,
  },
  {
    studyStatus: ['completed', 'analysis'] as StudyPhase[],
    title: 'Completed Studies',
    filterTitle: 'Completed',
    sectionStatus: 'COMPLETED' as DisplayStudyPhase,
  },
  {
    studyStatus: ['withdrawn'] as StudyPhase[],
    title: 'Withdrawn Studies',
    filterTitle: 'Withdrawn',
    sectionStatus: 'WITHDRAWN' as DisplayStudyPhase,
  },
]

type StudyListProps = StudyListOwnProps & RouteComponentProps

function getStudyLink(sectionStatus: DisplayStudyPhase, studyId: string) {
  const links = {
    builder: `${constants.restrictedPaths.STUDY_BUILDER}/session-creator`,
    participants: constants.restrictedPaths.PARTICIPANT_MANAGER,
  }

  let link = undefined
  if (sectionStatus === 'DRAFT') {
    link = Utility.isPathAllowed(studyId, links.builder)
      ? links.builder
      : Utility.isPathAllowed(studyId, links.participants)
      ? links.participants
      : undefined
  } else {
    link = Utility.isPathAllowed(studyId, links.participants)
      ? links.participants
      : undefined
  }
  return link ? link.replace(':id', studyId) : '#'
}

const StudySublist: FunctionComponent<StudySublistProps> = ({
  studies,
  status,
  renameStudyId,
  onAction,
  highlightedStudyId,
  menuAnchor,
}: StudySublistProps) => {
  const classes = useStyles()
  const item = sections.find(section => section.sectionStatus === status)!
  const displayStudies = studies.filter(study =>
    item.studyStatus.includes(study.phase)
  )

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
            style={{textDecoration: 'none'}}
            key={study.identifier || index}
            variant="body2"
            href={getStudyLink(status, study.identifier)}>
            <StudyCard
              study={study}
              onRename={(newName: string) => {
                onAction({...study, name: newName}, 'RENAME')
              }}
              isRename={renameStudyId === study.identifier}
              onSetAnchor={(e: HTMLElement) => {
                onAction(study, 'ANCHOR', e)
              }}
              isNewlyAddedStudy={highlightedStudyId === study.identifier}
              section={item.sectionStatus}
              isMenuOpen={
                menuAnchor?.study?.identifier === study.identifier
              }></StudyCard>
          </Link>
        ))}
      </Box>
    </>
  )
}

const StudyList: FunctionComponent<StudyListProps> = () => {
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  const handleError = useErrorHandler()

  const {token, roles} = useUserSessionDataState()
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

  const [statusFilters, setStatusFilters] = React.useState<DisplayStudyPhase[]>(
    sections.map(section => section.sectionStatus)
  )
  const [highlightedStudyId, setHighlightedStudyId] = React.useState<
    string | null
  >(null)

  let resetNewlyAddedStudyID: NodeJS.Timeout

  const {data: studies} = useStudies()

  const {mutate, isSuccess, isError, mutateAsync, data} = useUpdateStudy()

  const resetStatusFilters = () =>
    setStatusFilters(sections.map(section => section.sectionStatus))

  const createStudy = async (study?: Study) => {
    //if study is provided -- we are duplicating

    if (study) {
      mutateAsync({study, action: 'COPY'}).then(e => {
        //@ts-ignore
        const newStudy = e.study
        //@ts-ignore
        if (e.study) {
          setHighlightedStudyId(newStudy.identifier)
          resetNewlyAddedStudyID = setTimeout(() => {
            setHighlightedStudyId(null)
          }, 2000)
        }
        /* */
      })
    } else {
      const id = Utility.generateNonambiguousCode(6, 'CONSONANTS')
      const newStudy = {
        identifier: id,
        version: 1,
        clientData: {},
        phase: 'design' as StudyPhase,
        name: constants.constants.NEW_STUDY_NAME,
        signInTypes: [],
        createdOn: new Date(),
        modifiedOn: new Date(),
      }

      const version = await StudyService.createStudy(newStudy, token!)
      newStudy.version = version
      studyDataUpdateFn({
        type: 'SET_STUDY',
        payload: {study: newStudy},
      })

      window.location.replace(
        `${window.location.origin}/studies/builder/${id}/session-creator`
      )
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
        await mutate({action: 'UPDATE', study: {...study, name: study.name}})
        setRenameStudyId('')

        return

      case 'DELETE':
        await mutate({action: 'DELETE', study: {...study, name: study.name}})
        return

      case 'DUPLICATE':
        await createStudy(study)
        return
      default: {
      }
    }
  }

  const isSelectedFilter = (filter: DisplayStudyPhase) =>
    statusFilters.indexOf(filter) > -1 && statusFilters.length === 1

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
      <Box className={classes.root}>
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
                  }}>
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
                    }}>
                    {section.filterTitle}
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              disabled={
                !Utility.isPathAllowed(
                  'any',
                  constants.restrictedPaths.STUDY_BUILDER
                )
              }
              variant="contained"
              onClick={() => createStudy()}
              className={classes.createStudyButton}>
              + Create New Study
            </Button>
          </Box>
          <Divider className={classes.divider}></Divider>

          {studies &&
            studies.length > 0 &&
            statusFilters.map((status, index) => (
              <Box
                style={{paddingBottom: index < 3 ? '24px' : '0'}}
                key={status}>
                <StudySublist
                  userRoles={roles}
                  studies={studies!}
                  renameStudyId={renameStudyId}
                  status={status}
                  onAction={(s: Study, action: StudyAction, e: any) => {
                    action === 'ANCHOR'
                      ? setMenuAnchor({study: s, anchorEl: e})
                      : onAction(s, action)
                  }}
                  highlightedStudyId={highlightedStudyId}
                  menuAnchor={menuAnchor}
                />
              </Box>
            ))}

          <Menu
            id="study-menu"
            anchorEl={menuAnchor?.anchorEl}
            keepMounted
            open={Boolean(menuAnchor?.anchorEl)}
            onClose={handleMenuClose}
            classes={{paper: classes.paper, list: classes.list}}>
            <MenuItem
              href={
                menuAnchor?.study
                  ? getStudyLink(
                      StudyService.getDisplayStatusForStudyPhase(
                        menuAnchor!.study.phase
                      ),
                      menuAnchor!.study.identifier
                    )
                  : '#'
              }>
              View
            </MenuItem>
            {menuAnchor?.study.phase === 'design' && (
              <MenuItem
                onClick={() => {
                  setRenameStudyId(menuAnchor?.study.identifier)
                  handleMenuClose()
                }}>
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
            }}>
            <div>
              Are you sure you would like to permanently delete:{' '}
              <p>{menuAnchor?.study.name}</p>
            </div>
          </ConfirmationDialog>
        </Container>
      </Box>
    </Loader>
  )
}

export default StudyList
