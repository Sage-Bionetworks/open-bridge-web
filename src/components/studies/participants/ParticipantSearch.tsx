import {SimpleTextInput} from '@components/widgets/StyledComponents'
import ClearIcon from '@mui/icons-material/Clear'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'
import {Box, FormControl, IconButton, InputAdornment} from '@mui/material'
import {ParticipantActivityType} from '@typedefs/types'
import React, {useEffect} from 'react'

const ENTER_KEY = 'Enter'

type ParticipantSearchProps = {
  onReset: Function
  onSearch: Function
  isSearchById?: boolean
  tab?: ParticipantActivityType
}

const ParticipantSearch: React.FunctionComponent<ParticipantSearchProps> = ({onReset, onSearch, isSearchById, tab}) => {
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

  return (
    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <FormControl>
        <SimpleTextInput
          id="input-with-icon-textfield"
          onKeyDown={e => {
            if (e.key === ENTER_KEY) {
              handleSearchParticipantRequest()
            }
          }}
          sx={{'& .MuiInputBase-root': {borderRadius: '100px'}, '& input': {height: '28px'}}}
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
                <SearchTwoToneIcon sx={{color: '#878E95', fontSize: '24px'}} />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </Box>
  )
}

export default ParticipantSearch
