import {SimpleTextInput} from '@components/widgets/StyledComponents'
import ClearIcon from '@mui/icons-material/Clear'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'
import {Button, FormControl, IconButton, InputAdornment} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {ParticipantActivityType} from '@typedefs/types'
import React, {useEffect} from 'react'

const ENTER_KEY = 'Enter'

const useStyles = makeStyles(theme => ({
  participantIDSearchBar: {
    outline: 'none',
    height: '38px',
    width: '220px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    padding: theme.spacing(0.7),
    fontSize: '13px',
  },

  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

type ParticipantSearchProps = {
  onReset: Function
  onSearch: Function
  isSearchById?: boolean
  tab?: ParticipantActivityType
}

const ParticipantSearch: React.FunctionComponent<ParticipantSearchProps> = ({onReset, onSearch, isSearchById, tab}) => {
  const classes = useStyles()
  const [isSearchingForParticipant, setIsSearchingForParticipant] = React.useState(false)

  // True if the user is currently trying to search for a particular particpant
  const [isSearchingUsingId, setIsSearchingUsingID] = React.useState(false)
  // Reference to the input component for searching for a participant using ID.
  const inputComponent = React.useRef<HTMLInputElement>(null)

  const handleSearchParticipantRequest = async () => {
    const searchedValue = inputComponent.current?.value ? inputComponent.current?.value : ''
    setIsSearchingUsingID(true)

    onSearch(searchedValue)
  }

  const handleResetSearch = async () => {
    if (!inputComponent.current) return
    inputComponent.current!.value = ''
    setIsSearchingUsingID(false)
    onReset()
  }

  useEffect(() => {
    handleResetSearch()
  }, [tab])

  return isSearchingForParticipant ? (
    <div className={classes.inputRow}>
      <FormControl>
        <SimpleTextInput
          id="input-with-icon-textfield"
          onKeyDown={e => {
            if (e.key === ENTER_KEY) {
              handleSearchParticipantRequest()
            }
          }}
          sx={{borderRadius: '100px', '& input': {height: '28px'}}}
          placeholder={isSearchById ? "Participant's ID" : "Participant's Phone Number"}
          inputRef={inputComponent}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isSearchingUsingId && (
                  <IconButton onClick={handleResetSearch} id="clear-participant-search-text-button">
                    <ClearIcon sx={{color: '#878E95', fontSize: '14px'}} />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <SearchTwoToneIcon sx={{color: '#878E95'}} />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </div>
  ) : (
    <Button
      onClick={() => {
        setIsSearchingForParticipant(true)
      }}
      variant="text"
      color="primary"
      id="start-searching-for-participant-button"
      startIcon={<SearchTwoToneIcon />}>
      Find Participant
    </Button>
  )
}

export default ParticipantSearch
