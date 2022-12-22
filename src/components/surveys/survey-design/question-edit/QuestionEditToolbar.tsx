import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone'
import {Box, Button, styled} from '@mui/material'
import React, {FunctionComponent} from 'react'
import {ActionButton} from '../../widgets/SharedStyled'

const QuestionEditToolbarContainer = styled('div')(({theme}) => ({
  bottom: '0',
  // position: 'fixed',
  height: '54px',
  display: 'flex',
  //backgroundColor: 'blue',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',

  padding: theme.spacing(0, 3),
  margin: theme.spacing(3, 0),
}))

const DeleteButton: FunctionComponent<{
  onClick: () => void
  dependentQuestions: number[] | undefined
}> = ({onClick, dependentQuestions}) => {
  const isDisabled = !!dependentQuestions?.length

  const getText = (depQs: number[]) => {
    if (depQs.length === 1) {
      return `If you want to delete this question, first change the branching on question ${depQs[0]}.`
    }
    return `If you want to delete this question, first change the branching on questions: ${depQs.join(', ')}.`
  }
  if (!isDisabled) {
    return (
      <ActionButton
        startIcon={<DeleteTwoToneIcon sx={{color: '#FF4164'}} />}
        variant="text"
        onClick={onClick}
        color="error">
        Delete
      </ActionButton>
    )
  } else {
    return (
      <>
        <ActionButton startIcon={<DeleteTwoToneIcon />} disabled={true} variant="text" onClick={onClick}>
          Delete
        </ActionButton>
        <Box sx={{display: 'inline-flex', alignItems: 'center'}}>
          <InfoCircleWithToolTip
            style={{marginLeft: '0px'}}
            tooltipDescription={getText(dependentQuestions)}
            variant="info"
          />
        </Box>
      </>
    )
  }
}

const QuestionEditToolbar: FunctionComponent<{
  onAction: (action: 'save' | 'duplicate' | 'delete') => void
  isDynamic: boolean
  dependentQuestions: number[] | undefined
}> = ({onAction, dependentQuestions, isDynamic}) => {
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false)
  return (
    <>
      <QuestionEditToolbarContainer sx={{justifyContent: isDynamic ? 'space-between' : 'flex-end'}}>
        {isDynamic && (
          <div>
            <ActionButton startIcon={<FileCopyTwoToneIcon />} variant="text" onClick={() => onAction('duplicate')}>
              Duplicate
            </ActionButton>
            <DeleteButton dependentQuestions={dependentQuestions} onClick={() => setIsConfirmDelete(true)} />
          </div>
        )}
        <Button color="primary" variant="contained" onClick={() => onAction('save')}>
          Save Changes
        </Button>
      </QuestionEditToolbarContainer>
      <ConfirmationDialog
        isOpen={isConfirmDelete}
        title={'Delete Question'}
        type={'DELETE'}
        onCancel={() => setIsConfirmDelete(false)}
        onConfirm={() => {
          setIsConfirmDelete(false)
        }}>
        <div>
          <strong>Are you sure you would like to permanently delete this question?</strong>
        </div>
      </ConfirmationDialog>
    </>
  )
}

export default QuestionEditToolbar
