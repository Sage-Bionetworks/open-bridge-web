import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import Loader from '@components/widgets/Loader'
import Utility from '@helpers/utility'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from '@mui/material'
import {
  useAssessments,
  useUpdateSurveyAssessment,
} from '@services/assessmentHooks'
import {latoFont, poppinsFont, theme} from '@style/theme'
import constants from '@typedefs/constants'
import {Assessment} from '@typedefs/types'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Link, Redirect, useHistory} from 'react-router-dom'

const StyledSurveysContainer = styled('div', {label: 'StyledSurveyContainer'})(
  ({theme}) => ({
    display: 'grid',
    padding: theme.spacing(4, 0),
    justifyContent: 'center',
    margin: theme.spacing(3, 0),
    borderTop: '1px solid rgba(116, 116, 116, 0.5)',
    gridTemplateColumns: `repeat(auto-fill,220px)`,
    gridColumnGap: theme.spacing(3),
    gridRowGap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
      justifyContent: 'center',
      gridRowGap: theme.spacing(4),
    },
  })
)

const StyledSurveysCard = styled(Card, {
  label: 'StyledSurveysCard',
  shouldForwardProp: prop => prop !== 'isMenuOpen',
})<{
  isMenuOpen: boolean
}>(({theme, isMenuOpen}) => ({
  background: '#FCFCFC',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  height: '374px',
  width: '220px',
  '&>div': {
    padding: theme.spacing(2),
  },

  '& > div.top': {
    height: '172px',
    backgroundColor: '#F6F6F6',
  },
  '& h3': {
    fontFamily: poppinsFont,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: theme.spacing(1),
  },
  '& h5': {
    marginTop: theme.spacing(1),
    fontFamily: latoFont,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
  },
  ' .MuiIconButton-root': {
    padding: 0,
    margin: theme.spacing(-1, 0, 0, -1),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '>div': {
      boxShadow: isMenuOpen ? '-2px 1px 4px 1px rgba(0, 0, 0, 0.2)' : '',
    },
  },
}))

const AssessmentCard: React.FunctionComponent<{
  assessment: Assessment
  onClick: (e: HTMLElement) => void
  isMenuOpen: boolean
}> = ({isMenuOpen, onClick, assessment}) => {
  const _onClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    onClick(e.currentTarget)
  }

  return (
    <Link
      style={{textDecoration: 'none'}}
      key={assessment.identifier}
      to={`/surveys/${assessment.guid!}/design`}>
      <StyledSurveysCard isMenuOpen={isMenuOpen}>
        <div className="top">
          <IconButton onClick={_onClick} size="large">
            <div>
              <MoreVertIcon />
            </div>
          </IconButton>
        </div>
        <div>
          <h3> {assessment.title}</h3>
          <h5>Survey ID: {assessment.identifier}</h5>
        </div>
      </StyledSurveysCard>
    </Link>
  )
}

const AssessmentMenu: React.FunctionComponent<{
  anchorEl: Element
  onDelete: () => void
  onView: () => void
  onClose: () => void
  onDuplicate: () => void
}> = ({onDelete, onView, onDuplicate, onClose, anchorEl}) => {
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
      <MenuItem onClick={onDuplicate} key="duplicate">
        Duplicate
      </MenuItem>
      <MenuItem onClick={onDelete} key="delete">
        Delete
      </MenuItem>
    </Menu>
  )
}

const SurveyList: React.FunctionComponent<{}> = () => {
  const handleError = useErrorHandler()
  const history = useHistory()

  const [isNew, setIsNew] = React.useState(false)
  const [menuAnchor, setMenuAnchor] = React.useState<null | {
    survey: Assessment
    anchorEl: HTMLElement
  }>(null)

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState<
    'DELETE' | undefined
  >(undefined)

  const {
    data: surveys,
    status,
    error,
  } = useAssessments({isLocal: true, isSurvey: true})

  const {
    isSuccess: asmntUpdateSuccess,
    isError: asmntUpdateError,
    mutate: mutateAssessment,
  } = useUpdateSurveyAssessment()

  if (error) {
    handleError(error)
  }
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

  const onAction = async (survey: Assessment, type: 'DELETE' | 'DUPLICATE') => {
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

      case 'DUPLICATE':
        //resetStatusFilters()
        // await createStudy(study)
        alert('duplicate')
        return

      default: {
        console.log('unknow study action')
      }
    }
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: theme.spacing(5),
        }}>
        <Button
          disabled={
            !Utility.isPathAllowed(
              'any',
              constants.restrictedPaths.SURVEY_BUILDER
            )
          }
          variant="contained"
          onClick={e => setIsNew(true)}>
          + Create New Survey
        </Button>
      </Box>
      <Loader reqStatusLoading={status === 'loading'}>
        <StyledSurveysContainer key="container">
          {surveys?.map((survey, index) => (
            <AssessmentCard
              key={survey.identifier}
              assessment={survey}
              isMenuOpen={menuAnchor?.survey?.identifier === survey.identifier}
              onClick={e => setMenuAnchor({survey, anchorEl: e})}
            />
          ))}
        </StyledSurveysContainer>
      </Loader>
      {menuAnchor && (
        <AssessmentMenu
          anchorEl={menuAnchor.anchorEl}
          onClose={handleMenuClose}
          onDelete={() => setIsConfirmDialogOpen('DELETE')}
          onDuplicate={() => onAction(menuAnchor!.survey, 'DUPLICATE')}
          onView={() =>
            history.push(`/surveys/${menuAnchor?.survey.guid}/design/intro`)
          }
        />
      )}

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen === 'DELETE'}
        title={'Delete Study'}
        type={'DELETE'}
        onCancel={closeConfirmationDialog}
        onConfirm={() => {
          closeConfirmationDialog()
          onAction(menuAnchor!.survey, 'DELETE')
        }}>
        <div>
          Are you sure you would like to permanently delete:{' '}
          <p>{menuAnchor?.survey.title}</p>
        </div>
      </ConfirmationDialog>
    </Container>
  )
}
export default SurveyList
