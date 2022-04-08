import {useStudies, useUpdateStudyInList} from '@components/studies/studyHooks'
import ConfirmationDialog, {
  ConfirmationDialogType,
} from '@components/widgets/ConfirmationDialog'
import {MTBHeading} from '@components/widgets/Headings'
import Loader from '@components/widgets/Loader'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {useStudyInfoDataDispatch} from '@helpers/StudyInfoContext'
import Utility from '@helpers/utility'
import {Box, Button, Container, Divider, Menu, MenuItem} from '@mui/material'
import Link from '@mui/material/Link'
import makeStyles from '@mui/styles/makeStyles'
import StudyService from '@services/study.service'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {AdminRole, DisplayStudyPhase, Study, StudyPhase} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Redirect, RouteComponentProps} from 'react-router-dom'
import StudyCard from './StudyCard'

type StudyListOwnProps = {}

type StudySublistProps = {
  status: DisplayStudyPhase
  userRoles: AdminRole[]
  studies: Study[]
  onStudyCardClick: Function
  renameStudyId: string
  highlightedStudyId: string | null
  menuAnchor: {
    study: Study
    anchorEl: HTMLElement
  } | null
}

type StudyAction =
  | 'DELETE'
  | 'ANCHOR'
  | 'DUPLICATE'
  | 'RENAME'
  | 'VIEW'
  | 'WITHDRAW'
  | 'CLOSE'

const studyCardWidth = '290'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F3EFE5',
    height: '100%',
    minHeight: 'calc(100vh - 104px)',
    [theme.breakpoints.down('lg')]: {
      minHeight: '100vh',
    },
  },
  studyContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
      justifyContent: 'center',
      gridRowGap: theme.spacing(4),
    },
  },
  divider: {
    margin: `${theme.spacing(1)} 0 ${theme.spacing(5)} 0`,
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
    borderRadius: '4px',
    width: '160px',
    height: '49px',
    fontSize: '12px',
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
    filterTitle: 'Draft',
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
  onStudyCardClick,
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
      <MTBHeading variant="h2" align={'left'}>
        {item.title}
      </MTBHeading>
      <Box className={classes.cardGrid}>
        {displayStudies.map((study, index) => (
          <Link
            style={{textDecoration: 'none'}}
            key={study.identifier || index}
            variant="body2"
            onClick={() =>
              study.identifier === '...'
                ? ''
                : onStudyCardClick({...study}, 'VIEW')
            }
            underline="hover">
            <StudyCard
              study={study}
              onRename={(newName: string) => {
                onStudyCardClick({...study, name: newName}, 'RENAME')
              }}
              isRename={renameStudyId === study.identifier}
              onSetAnchor={(e: HTMLElement) => {
                onStudyCardClick(study, 'ANCHOR', e)
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
    setIsConfirmDialogOpen(undefined)
    setMenuAnchor(null)
  }
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState<
    ConfirmationDialogType | undefined
  >(undefined)

  const [statusFilters, setStatusFilters] = React.useState<DisplayStudyPhase[]>(
    sections.map(section => section.sectionStatus)
  )
  const [highlightedStudyId, setHighlightedStudyId] = React.useState<
    string | null
  >(null)
  const [redirectLink, setRedirectLink] = React.useState('')

  let resetNewlyAddedStudyID: NodeJS.Timeout

  const {
    data: studies,
    error: studyError,
    isLoading: isStudyLoading,
  } = useStudies()

  const {
    mutate,
    isSuccess,
    isError,
    mutateAsync,
    data,
    isLoading: isStudyUpdating,
    variables: mutateData,
  } = useUpdateStudyInList()
  if (studyError) {
    handleError(studyError)
  }

  const resetStatusFilters = () =>
    setStatusFilters(sections.map(section => section.sectionStatus))

  const createStudy = async (study?: Study) => {
    //if study is provided -- we are duplicating

    if (study) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      mutateAsync({study, action: 'COPY'}).then(e => {
        const newStudy = e[0]
        if (newStudy) {
          setHighlightedStudyId(newStudy.identifier)
          resetNewlyAddedStudyID = setTimeout(() => {
            setHighlightedStudyId(null)
          }, 2000)
        }
      })
    } else {
      const id = Utility.generateNonambiguousCode(6, 'CONSONANTS')
      const newStudy = {
        identifier: id,
        version: 1,
        clientData: StudyService.getDefaultClientData(),
        phase: 'design' as StudyPhase,
        name: constants.constants.NEW_STUDY_NAME,
        signInTypes: [],
        createdOn: new Date(),
        modifiedOn: new Date(),
      }

      mutateAsync({
        action: 'CREATE',
        study: {...newStudy, name: newStudy.name},
      }).then(studies => {
        if (studies[0]) {
          navigateToStudy(studies[0])
        }
      })
    }
  }

  const navigateToStudy = (study?: Study) => {
    if (study) {
      const l = getStudyLink(
        StudyService.getDisplayStatusForStudyPhase(study.phase),
        study.identifier
      )
      studyDataUpdateFn({
        type: 'SET_STUDY',
        payload: {study: study},
      })

      setRedirectLink(l)
    }
  }

  const onAction = async (study: Study, type: StudyAction) => {
    handleMenuClose()
    let result
    switch (type) {
      case 'RENAME':
        await mutate({action: 'RENAME', study: {...study, name: study.name}})
        setRenameStudyId('')

        return
      case 'WITHDRAW':
      case 'CLOSE':
      case 'DELETE':
        await mutate({action: type, study})
        return

      case 'DUPLICATE':
        await createStudy(study)
        return
      default: {
        console.log('unknow study action')
      }
    }
  }

  const isSelectedFilter = (filter: DisplayStudyPhase) =>
    statusFilters.indexOf(filter) > -1 && statusFilters.length === 1

  if (redirectLink) {
    return <Redirect to={redirectLink} />
  }

  if (!studies && !isStudyLoading) {
    return (
      <div>
        You currently have no studies created. To begin, please click on Create
        New Study.
      </div>
    )
  }

  const getPhase = () =>
    !menuAnchor
      ? undefined
      : StudyService.getDisplayStatusForStudyPhase(menuAnchor.study.phase)

  return (
    <Loader
      reqStatusLoading={
        isStudyLoading ||
        !studies ||
        (isStudyUpdating && mutateData?.action === 'CREATE')
      }
      variant="full">
      <Box className={classes.root}>
        <Container maxWidth="lg" className={classes.studyContainer}>
          <Box display="flex" justifyContent="space-between" area-lable="f1">
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
                  onStudyCardClick={(s: Study, action: StudyAction, e: any) => {
                    switch (action) {
                      case 'ANCHOR':
                        setMenuAnchor({study: s, anchorEl: e})
                        break
                      case 'VIEW':
                        handleMenuClose()
                        navigateToStudy(s)
                        break
                      case 'RENAME':
                        onAction(s, 'RENAME')
                        break
                      default:
                        console.log('unknown study action')
                    }
                  }}
                  highlightedStudyId={highlightedStudyId}
                  menuAnchor={menuAnchor}
                />
              </Box>
            ))}

          {menuAnchor && (
            <Menu
              id="study-menu"
              anchorEl={menuAnchor.anchorEl}
              keepMounted
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(menuAnchor.anchorEl)}
              onClose={handleMenuClose}
              classes={{paper: classes.paper, list: classes.list}}>
              <MenuItem onClick={() => navigateToStudy(menuAnchor?.study)}>
                View
              </MenuItem>
              {(getPhase() === 'DRAFT' || getPhase() === 'LIVE') && (
                <MenuItem
                  onClick={() => {
                    setRenameStudyId(menuAnchor?.study.identifier)
                    handleMenuClose()
                  }}>
                  Rename
                </MenuItem>
              )}

              <MenuItem
                onClick={() => onAction(menuAnchor!.study, 'DUPLICATE')}>
                Duplicate
              </MenuItem>

              {(getPhase() === 'DRAFT' || getPhase() === 'WITHDRAWN') && (
                <MenuItem onClick={() => setIsConfirmDialogOpen('DELETE')}>
                  Delete
                </MenuItem>
              )}

              {getPhase() === 'LIVE' && [
                <MenuItem
                  onClick={() => setIsConfirmDialogOpen('WITHDRAW_STUDY')}>
                  Withdraw Study
                </MenuItem>,
                <MenuItem onClick={() => setIsConfirmDialogOpen('CLOSE_STUDY')}>
                  Close Study
                </MenuItem>,
              ]}
            </Menu>
          )}

          <ConfirmationDialog
            isOpen={isConfirmDialogOpen === 'WITHDRAW_STUDY'}
            title={'Withdraw a Study'}
            actionText="Yes, withdraw study"
            type={'WITHDRAW_STUDY'}
            onCancel={closeConfirmationDialog}
            onConfirm={() => {
              closeConfirmationDialog()
              onAction(menuAnchor!.study, 'WITHDRAW')
            }}>
            <div>
              <p>
                By withdrawing this study, you are closing it early and can no
                longer enroll future participants. Data collection from existing
                participants will stop.
              </p>

              <p>
                {' '}
                Are you sure you would like to stop the following study early:
              </p>
              <p>
                <strong>{menuAnchor?.study.name}</strong>
              </p>
              <p>
                <strong>This action cannot be undone.</strong>
              </p>
            </div>
          </ConfirmationDialog>

          <ConfirmationDialog
            isOpen={isConfirmDialogOpen === 'CLOSE_STUDY'}
            title={'Close Study'}
            type={'CLOSE_STUDY'}
            actionText="Yes, this study is complete"
            onCancel={closeConfirmationDialog}
            onConfirm={() => {
              closeConfirmationDialog()
              onAction(menuAnchor!.study, 'CLOSE')
            }}>
            <div>
              <p>
                By closing this study, you are stopping enrollment of new
                participants and data collection from existing participants will
                stop.
              </p>
              <p>
                <strong>This action cannot be undone.</strong>
              </p>

              <p> Close the following study?</p>
              <p>
                <strong>{menuAnchor?.study.name}</strong>
              </p>
            </div>
          </ConfirmationDialog>

          <ConfirmationDialog
            isOpen={isConfirmDialogOpen === 'DELETE'}
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
