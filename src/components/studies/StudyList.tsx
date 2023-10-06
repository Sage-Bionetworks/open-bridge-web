import {default as CollapsableMenu} from '@components/surveys/widgets/MenuDropdown'
import AlertBanner from '@components/widgets/AlertBanner'
import ConfirmationDialog, {ConfirmationDialogType} from '@components/widgets/ConfirmationDialog'
import Loader from '@components/widgets/Loader'
import {useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import {Box, Button, Container, Menu, MenuItem, styled, Typography} from '@mui/material'
import Link from '@mui/material/Link'
import StudyService from '@services/study.service'
import {useStudies, useUpdateStudyInList} from '@services/studyHooks'
import {latoFont, theme} from '@style/theme'
import constants from '@typedefs/constants'
import {AdminRole, DisplayStudyPhase, SignInType, Study, StudyPhase} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Redirect, RouteComponentProps} from 'react-router-dom'
import StudyCard from './StudyCard'

type StudyListOwnProps = {}

type StudySublistProps = {
  status: DisplayStudyPhase | null
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

type StudyAction = 'DELETE' | 'ANCHOR' | 'DUPLICATE' | 'RENAME' | 'VIEW' | 'WITHDRAW' | 'CLOSE'

const studyCardWidth = '357'

const StyledStudyListGrid = styled(Box, {label: 'StyledStudyListGrid'})(({theme}) => ({
  display: 'grid',
  padding: theme.spacing(0),
  gridTemplateColumns: `repeat(auto-fill,${studyCardWidth}px)`,
  gridColumnGap: theme.spacing(2),
  gridRowGap: theme.spacing(2),
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    justifyContent: 'center',
    gridRowGap: theme.spacing(4),
  },
}))

const StyledContextMenu = styled(Menu, {label: 'StyledContextMenu'})(({theme}) => ({
  '& .MuiPaper-root': {
    marginLeft: theme.spacing(3.5),
    borderRadius: '0px',
    '& li': {
      padding: theme.spacing(1.25, 2, 1.25, 2),
    },
    boxShadow: '2px 1.5px 2px 1px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiMenu-list': {
    fontFamily: latoFont,
    fontSize: '14px',
    lineHeight: '17px',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}))

const sections = [
  {
    studyStatus: [] as StudyPhase[],
    title: 'All Studies',
    filterTitle: 'All',
  },
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
    builder: `${constants.restrictedPaths.STUDY_BUILDER}/study-details`,
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
    link = Utility.isPathAllowed(studyId, links.participants) ? links.participants : undefined
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
  const section = sections.find(section => section.sectionStatus === status)!
  const displayStudies = section ? studies.filter(study => section.studyStatus.includes(study.phase)) : studies

  if (!displayStudies.length /*|| !section.sectionStatus*/) {
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
      <StyledStudyListGrid>
        {displayStudies.map((study, index) => (
          <Link
            style={{textDecoration: 'none'}}
            key={study.identifier || index}
            variant="body2"
            onClick={() => (study.identifier === '...' ? '' : onStudyCardClick({...study}, 'VIEW'))}
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
              // section={section.sectionStatus}
              isMenuOpen={menuAnchor?.study?.identifier === study.identifier}></StudyCard>
          </Link>
        ))}
      </StyledStudyListGrid>
    </>
  )
}

const VerifyBanner: FunctionComponent = () => {
  const [displayVerifyBanner, setDisplayVerifyBanner] = React.useState<boolean>(true)

  const displayText = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Box
        sx={{
          mx: 2,
          width: '60%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
        <strong>Get Verified to launch your studies</strong>
        <br />
        You can create studies but will not be able to launch them until you're Verified. Verification can take a bit of
        time so it's best to start this process early!
      </Box>
      <Button sx={{flexShrink: 0, flexGrow: 0}} variant="contained" href={Utility.getRedirectLinkToOneSage('validate')}>
        Become Verified
      </Button>
    </Box>
  )

  return (
    <AlertBanner
      backgroundColor="rgba(255, 242, 222)"
      textColor="#22252A"
      onClose={() => {
        setDisplayVerifyBanner(false)
      }}
      isVisible={displayVerifyBanner}
      icon={<InfoTwoToneIcon sx={{color: '#FFA825'}} />}
      isSelfClosing={false}
      displayBottomOfPage={true}
      displayText={displayText}
      borderLeftColor="#FFA825"
      isFullWidthMessage={true}
    />
  )
}

const StudyList: FunctionComponent<StudyListProps> = () => {
  const handleError = useErrorHandler()
  const {isVerified} = useUserSessionDataState()

  const {roles} = useUserSessionDataState()
  const [menuAnchor, setMenuAnchor] = React.useState<null | {
    study: Study
    anchorEl: HTMLElement
  }>(null)
  const [renameStudyId, setRenameStudyId] = React.useState('')

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }
  const closeConfirmationDialog = () => {
    setIsConfirmDialogOpen(undefined)
    setMenuAnchor(null)
  }

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState<ConfirmationDialogType | undefined>(undefined)

  const [statusFilter, setStatusFilter] = React.useState<DisplayStudyPhase | null>(null)

  const [highlightedStudyId, setHighlightedStudyId] = React.useState<string | null>(null)
  const [redirectLink, setRedirectLink] = React.useState('')
  const {data: studies, error: studyError, isLoading: isStudyLoading} = useStudies()

  const {mutate, mutateAsync, isLoading: isStudyUpdating, variables: mutateData} = useUpdateStudyInList()
  if (studyError) {
    handleError(studyError)
  }

  const resetStatusFilters = () => {
    setStatusFilter(null)
  }
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [statusFilter])

  const createStudy = async (study?: Study) => {
    //if study is provided -- we are duplicating

    if (study) {
      mutateAsync({study, action: 'COPY'}).then(e => {
        const newStudy = e[0]
        if (newStudy) {
          setHighlightedStudyId(newStudy.identifier)
          setTimeout(() => {
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
        //agendel 10/6 adding  default to signin with study Id signInTypes: SignInType[]
        signInTypes: ['external_id_password' as SignInType],
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
      const l = getStudyLink(StudyService.getDisplayStatusForStudyPhase(study.phase), study.identifier)

      setRedirectLink(l)
    }
  }

  const onAction = async (study: Study, type: StudyAction) => {
    handleMenuClose()
    switch (type) {
      case 'RENAME':
        mutate({action: 'RENAME', study: {...study, name: study.name}})
        setRenameStudyId('')

        return
      case 'WITHDRAW':
      case 'CLOSE':
      case 'DELETE':
        mutate({action: type, study})
        return

      case 'DUPLICATE':
        resetStatusFilters()
        await createStudy(study)
        return
      default: {
        console.log('unknow study action')
      }
    }
  }

  const isSelectedFilter = (section: typeof sections[1]) => {
    if (!section.sectionStatus) {
      return !statusFilter
    }
    return statusFilter === section.sectionStatus
  }

  if (redirectLink) {
    return <Redirect to={redirectLink} />
  }

  if (!studies && !isStudyLoading) {
    return <div>You currently have no studies created. To begin, please click on Create New Study.</div>
  }

  const getPhase = () => (!menuAnchor ? undefined : StudyService.getDisplayStatusForStudyPhase(menuAnchor.study.phase))

  return (
    <Loader
      reqStatusLoading={isStudyLoading || !studies || (isStudyUpdating && mutateData?.action === 'CREATE')}
      variant="full">
      <Box>
        <Box
          area-lable="f1"
          id="menucontainer"
          sx={{
            position: 'relative',
            height: '120px',
            borderBottom: '1px solid #DFE2E6',
            padding: theme.spacing(0, 4),
            paddingTop: [theme.spacing(4), theme.spacing(4), theme.spacing(4), theme.spacing(6.75)],
          }}>
          <CollapsableMenu
            items={sections.map(s => ({...s, enabled: true, id: s.filterTitle}))}
            selectedFn={section => isSelectedFilter(section)}
            displayMobileItem={(section, _isSelected) => <>{section.filterTitle}</>}
            displayDesktopItem={(section, _isSelected) => <Box sx={{minWidth: '120px'}}> {section.filterTitle}</Box>}
            onClick={section => (section.sectionStatus ? setStatusFilter(section.sectionStatus) : resetStatusFilters())}
          />

          <Button
            disabled={!Utility.isPathAllowed('any', constants.restrictedPaths.STUDY_BUILDER)}
            variant="contained"
            sx={{position: 'absolute', top: '34px', right: theme.spacing(4)}}
            onClick={() => createStudy()}>
            + Create New Study
          </Button>
        </Box>

        <Box sx={{backgroundColor: '#FBFBFC', paddingTop: theme.spacing(7)}}>
          <Container maxWidth="lg">
            {studies && studies.length > 0 && (
              <Box sx={{paddingBottom: '24px'}} key={statusFilter || 'all'}>
                <StudySublist
                  userRoles={roles}
                  studies={studies!}
                  renameStudyId={renameStudyId}
                  status={statusFilter}
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
            )}

            {menuAnchor && (
              <StyledContextMenu
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
                onClose={handleMenuClose}>
                <MenuItem onClick={() => navigateToStudy(menuAnchor?.study)}>View</MenuItem>
                {(getPhase() === 'DRAFT' || getPhase() === 'LIVE') && (
                  <MenuItem
                    onClick={() => {
                      setRenameStudyId(menuAnchor?.study.identifier)
                      handleMenuClose()
                    }}>
                    Rename
                  </MenuItem>
                )}

                <MenuItem onClick={() => onAction(menuAnchor!.study, 'DUPLICATE')}>Duplicate</MenuItem>

                {(getPhase() === 'DRAFT' || getPhase() === 'WITHDRAWN') && (
                  <MenuItem onClick={() => setIsConfirmDialogOpen('DELETE')}>Delete</MenuItem>
                )}

                {getPhase() === 'LIVE' && [
                  <MenuItem onClick={() => setIsConfirmDialogOpen('WITHDRAW_STUDY')}>Withdraw Study</MenuItem>,
                  <MenuItem onClick={() => setIsConfirmDialogOpen('CLOSE_STUDY')}>Close Study</MenuItem>,
                ]}
              </StyledContextMenu>
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
                  By withdrawing this study, you are closing it early and can no longer enroll future participants. Data
                  collection from existing participants will stop.
                </p>

                <p> Are you sure you would like to stop the following study early:</p>
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
              title={'Close a Study'}
              type={'CLOSE_STUDY'}
              actionText="Yes, this study is complete"
              onCancel={closeConfirmationDialog}
              onConfirm={() => {
                closeConfirmationDialog()
                onAction(menuAnchor!.study, 'CLOSE')
              }}>
              <div>
                <p>
                  By closing this study, you are stopping enrollment of new participants and data collection from
                  existing participants will stop.
                </p>
                <Typography component="p" sx={{fontSize: '16px', fontWeight: 900, margin: theme.spacing(2, 0)}}>
                  Are you sure you would like to close the following study?
                </Typography>

                <p>
                  <Typography sx={{fontSize: '16px'}}>{menuAnchor?.study.name}</Typography>
                </p>

                <Typography component="p" sx={{color: '#FF4164', fontWeight: 700}}>
                  This action cannot be undone.
                </Typography>
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
                Are you sure you would like to permanently delete: <p>{menuAnchor?.study.name}</p>
              </div>
            </ConfirmationDialog>
          </Container>
        </Box>
      </Box>
      {isVerified !== true && <VerifyBanner />}
    </Loader>
  )
}

export default StudyList
