import {ReactComponent as DeleteIcon} from '@assets/surveys/actions/delete.svg'
import {ReactComponent as DuplicateIcon} from '@assets/surveys/actions/duplicate.svg'
import {ReactComponent as SaveIcon} from '@assets/surveys/actions/save.svg'
import {Box} from '@mui/material'
import {theme} from '@style/theme'
import {FunctionComponent} from 'react'
import {ActionButton} from '../../widgets/SharedStyled'

const QuestionEditToolbar: FunctionComponent<{
  onAction: (action: 'save' | 'duplicate' | 'delete') => void
}> = ({onAction}) => {
  return (
    <Box
      sx={{
        bottom: '0',
        position: 'fixed',
        height: '54px',
        display: 'flex',
        // border: '1px solid black',
        flexDirection: 'row',
        alignItems: 'center',
        width: '425px',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 2.5),
      }}>
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
        <ActionButton
          startIcon={<DeleteIcon />}
          variant="text"
          onClick={() => onAction('delete')}>
          Delete
        </ActionButton>
      </div>
    </Box>
  )
}

export default QuestionEditToolbar
