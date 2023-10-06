import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import Loader from '@components/widgets/Loader'
import Utility from '@helpers/utility'
import {Alert, Box, Button, Container, Menu, MenuItem, styled} from '@mui/material'
import Link from '@mui/material/Link'
import {useAssessments, useUpdateSurveyAssessment} from '@services/assessmentHooks'
import {theme} from '@style/theme'
import constants from '@typedefs/constants'
import {Assessment} from '@typedefs/types'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Redirect, useHistory} from 'react-router-dom'
import SurveyCard from './SurveyCard'
import CollapsableMenu from './widgets/MenuDropdown'

const cardWidth = '357'

const StyledSurveysContainer = styled(Box, {label: 'StyledStudyListGrid'})(({theme}) => ({
  display: 'grid',
  padding: theme.spacing(0),
  gridTemplateColumns: `repeat(auto-fill,${cardWidth}px)`,
  gridColumnGap: theme.spacing(2),
  gridRowGap: theme.spacing(2),
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    justifyContent: 'center',
    gridRowGap: theme.spacing(4),
  },
}))

const AssessmentMenu: React.FunctionComponent<{
  anchorEl: Element
  onDelete: () => void
  onView: () => void
  onClose: () => void
  onDuplicate: () => void
  onRename: () => void
}> = ({onDelete, onView, onDuplicate, onClose, onRename, anchorEl}) => {
  return (
    <Menu
      id="assessment-menu"
      anchorEl={anchorEl}
      keepMounted
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}>
      <MenuItem onClick={onView} key="view">
        View
      </MenuItem>
      <MenuItem onClick={onRename} key="rename">
        Rename
      </MenuItem>
      <MenuItem onClick={onDuplicate} key="duplicate">
        Duplicate
      </MenuItem>
      <MenuItem onClick={onDelete} key="delete">
        Delete
      </MenuItem>
    </Menu>
  )
}

const sections = [
  {
    title: 'All',
    filterTitle: 'All',
  },
  {
    title: 'Draft',
    filterTitle: 'Draft',
  },
  {
    title: 'Published',
    filterTitle: 'Published',
  },
  {
    title: 'Created By Me',
    filterTitle: 'Created By Me',
  },
  {
    title: 'Shared With Me',
    filterTitle: 'Shared With Me',
  },
]

const SurveyList: React.FunctionComponent<{}> = () => {
  const handleError = useErrorHandler()
  const history = useHistory()

  const [isNew, setIsNew] = React.useState(false)
  const [renameSurveyId, setRenameSurveyId] = React.useState('')
  const [menuAnchor, setMenuAnchor] = React.useState<null | {
    survey: Assessment
    anchorEl: HTMLElement
  }>(null)
  const [highlightedStudyId, setHighlightedStudyId] = React.useState<string | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState<'DELETE' | undefined>(undefined)

  const {
    data: surveys,
    status: getSurveysStatus,
    error: getSurveysError,
  } = useAssessments({isLocal: true, isSurvey: true})

  const {error: asmntUpdateError, mutate: mutateAssessment} = useUpdateSurveyAssessment()

  if (isNew) {
    return <Redirect to={`${constants.restrictedPaths.SURVEY_BUILDER}/intro`} />
  }

  const closeConfirmationDialog = () => {
    setIsConfirmDialogOpen(undefined)
    setMenuAnchor(null)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const onAction = async (survey: Assessment, type: 'DELETE' | 'DUPLICATE' | 'RENAME') => {
    handleMenuClose()
    switch (type) {
      case 'DELETE':
        // await mutate({ action: type, study })
        mutateAssessment(
          {assessment: survey, action: 'DELETE'},
          {
            onSuccess: data => {
              // alert('done')
            },
            onError: e => alert(e),
          }
        )
        break
      case 'RENAME':
        await mutateAssessment(
          {action: 'UPDATE', survey: {...survey, title: survey.title}},
          {
            onSuccess: data => {
              // alert('done')
            },
            onError: e => alert(e),
          }
        )
        setRenameSurveyId('')

        return
      case 'DUPLICATE':
        mutateAssessment(
          {
            assessment: {...survey, title: `Copy of ${survey.title}`},
            action: 'COPY',
          },
          {
            onSuccess: data => {
              setHighlightedStudyId(data.guid!)
              setTimeout(() => {
                setHighlightedStudyId(null)
              }, 2000)
              // alert('done')
            },
            onError: e => alert(e),
          }
        )
        return

      default: {
        console.log('unknow study action')
      }
    }
  }

  return (
    <Container maxWidth="xl">
      {getSurveysError && <Alert severity="error">{getSurveysError.message}</Alert>}
      {asmntUpdateError && <Alert severity="error">{asmntUpdateError.message}</Alert>}

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
          selectedFn={section => /*isSelectedFilter(section)*/ false}
          displayMobileItem={(section, isSelected) => <>{section.filterTitle}</>}
          displayDesktopItem={(section, isSelected) => <Box sx={{minWidth: '120px'}}> {section.filterTitle}</Box>}
          onClick={
            section => {} /*(section.sectionStatus ? setStatusFilter(section.sectionStatus) : resetStatusFilters())*/
          }
        />

        <Button
          disabled={!Utility.isPathAllowed('any', constants.restrictedPaths.SURVEY_BUILDER)}
          variant="contained"
          sx={{position: 'absolute', top: '34px', right: theme.spacing(4)}}
          onClick={e => setIsNew(true)}>
          + Create New Survey
        </Button>
      </Box>

      <Loader reqStatusLoading={getSurveysStatus === 'loading'}>
        <Box sx={{backgroundColor: '#FBFBFC', paddingTop: theme.spacing(7)}}>
          <Container maxWidth="lg">
            <StyledSurveysContainer key="container">
              {surveys?.map((survey, index) => (
                <Link
                  component="button"
                  style={{textDecoration: 'none'}}
                  key={survey.guid}
                  variant="body2"
                  onClick={() => history.push(`/surveys/${survey.guid}/design/intro`)}
                  underline="hover">
                  <SurveyCard
                    key={survey.guid}
                    shouldHighlight={highlightedStudyId === survey.guid}
                    survey={survey}
                    isMenuOpen={menuAnchor?.survey?.guid === survey.guid}
                    onSetAnchor={(e: any) => setMenuAnchor({survey, anchorEl: e})}
                    isRename={renameSurveyId === survey.guid}
                    onRename={(name: string) => onAction({...survey, title: name}, 'RENAME')}
                  />
                </Link>
              ))}
            </StyledSurveysContainer>
          </Container>
        </Box>
      </Loader>
      {menuAnchor && (
        <AssessmentMenu
          anchorEl={menuAnchor.anchorEl}
          onClose={handleMenuClose}
          onRename={() => setRenameSurveyId(menuAnchor!.survey.guid!)}
          onDelete={() => setIsConfirmDialogOpen('DELETE')}
          onDuplicate={() => onAction(menuAnchor!.survey, 'DUPLICATE')}
          onView={() => history.push(`/surveys/${menuAnchor?.survey.guid}/design/intro`)}
        />
      )}

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen === 'DELETE'}
        title={'Delete Survey'}
        type={'DELETE'}
        onCancel={closeConfirmationDialog}
        onConfirm={() => {
          closeConfirmationDialog()
          onAction(menuAnchor!.survey, 'DELETE')
        }}>
        <div>
          Are you sure you would like to permanently delete: <p>{menuAnchor?.survey.title}</p>
        </div>
      </ConfirmationDialog>
    </Container>
  )
}
export default SurveyList
