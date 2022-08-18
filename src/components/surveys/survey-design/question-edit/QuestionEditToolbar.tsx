import {ReactComponent as DeleteIcon} from '@assets/surveys/actions/delete.svg'
import {ReactComponent as DuplicateIcon} from '@assets/surveys/actions/duplicate.svg'
import {ReactComponent as SaveIcon} from '@assets/surveys/actions/save.svg'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import {Box, styled} from '@mui/material'
import React, {FunctionComponent} from 'react'
import {ActionButton} from '../../widgets/SharedStyled'

const ToolbarContainer = styled('div')(({theme}) => ({
  bottom: '0',
  position: 'fixed',
  height: '54px',
  display: 'flex',
  backgroundColor: '#f7f7f7',
  flexDirection: 'row',
  alignItems: 'center',
  width: '425px',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2.5),
}))

const DeleteButton: FunctionComponent<{
  onClick: () => void
  dependentQuestions: number[] | undefined
}> = ({onClick, dependentQuestions}) => {
  const isDisabled = !!dependentQuestions?.length
  if (!isDisabled) {
    return (
      <ActionButton startIcon={<DeleteIcon />} variant="text" onClick={onClick}>
        Delete
      </ActionButton>
    )
  } else {
    return (
      <>
        <ActionButton
          startIcon={<DeleteIcon />}
          disabled={true}
          variant="text"
          onClick={onClick}>
          Delete
        </ActionButton>
        <Box sx={{display: 'inline-flex', alignItems: 'center'}}>
          <InfoCircleWithToolTip
            style={{marginLeft: '0px'}}
            tooltipDescription={
              'If you want to delete this question, first change the branching on questions: ' +
              dependentQuestions?.map(index => ++index).join(',')
            }
            variant="info"
          />
        </Box>
      </>
    )
  }
}

const QuestionEditToolbar: FunctionComponent<{
  onAction: (action: 'save' | 'duplicate' | 'delete') => void
  dependentQuestions: number[] | undefined
}> = ({onAction, dependentQuestions}) => {
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false)
  return (
    <>
      <ToolbarContainer>
        <ActionButton
          startIcon={<SaveIcon />}
          variant="text"
          onClick={() => onAction('save')}>
          Save Changes
        </ActionButton>
        <div>
          <ActionButton
            startIcon={<DuplicateIcon />}
            variant="text"
            onClick={() => onAction('duplicate')}>
            Duplicate
          </ActionButton>
          <DeleteButton
            dependentQuestions={dependentQuestions}
            onClick={() => setIsConfirmDelete(true)}
          />
        </div>
      </ToolbarContainer>
      <ConfirmationDialog
        isOpen={isConfirmDelete}
        title={'Delete Question'}
        type={'DELETE'}
        onCancel={() => setIsConfirmDelete(false)}
        onConfirm={() => {
          onAction('delete')
          setIsConfirmDelete(false)
        }}>
        <div>
          <strong>
            Are you sure you would like to permanently delete this question?
          </strong>
        </div>
      </ConfirmationDialog>
    </>
  )
}

export default QuestionEditToolbar
