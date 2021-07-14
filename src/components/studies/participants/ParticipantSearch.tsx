import {Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {useEffect} from 'react'
import BlackXIcon from '../../../assets/black_x_icon.svg'
import SearchIcon from '../../../assets/search_icon.svg'
import WhiteSearchIcon from '../../../assets/white_search_icon.svg'
import {latoFont} from '../../../style/theme'

const ENTER_KEY = 'Enter'

const useStyles = makeStyles(theme => ({
  participantIDSearchBar: {
    backgroundColor: 'white',
    outline: 'none',
    height: '38px',
    width: '220px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    padding: theme.spacing(0.7),
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '0px',
    fontSize: '13px',
  },
  topButtons: {
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '36px',
    fontSize: '14px',
    fontFamily: latoFont,
  },
  buttonImage: {
    marginRight: theme.spacing(0.75),
    width: '14px',
  },
  searchIconContainer: {
    width: '42px',
    height: '38px',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'black',
      boxShadow: '1px 1px 1px rgb(0, 0, 0, 0.75)',
    },
    borderRadius: '0px',
    minWidth: '0px',
  },
  blackXIconButton: {
    marginLeft: '195px',
    position: 'absolute',
    minWidth: '0px',
    width: '18px',
    height: '18px',
    minHeight: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15px',
    '&:hover': {
      backgroundColor: 'rgb(0, 0, 0, 0.2)',
    },
    display: 'flex',
  },
  blackXIcon: {
    width: '10px',
    height: '10px',
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
  isEnrolledById?: boolean
  forceSearchReset?: boolean
}

const ParticipantSearch: React.FunctionComponent<ParticipantSearchProps> = ({
  onReset,
  onSearch,
  isEnrolledById,
  forceSearchReset,
}) => {
  const classes = useStyles()
  const [
    isSearchingForParticipant,
    setIsSearchingForParticipant,
  ] = React.useState(false)

  // True if the user is currently trying to search for a particular particpant
  const [isSearchingUsingId, setIsSearchingUsingID] = React.useState(false)
  // Reference to the input component for searching for a participant using ID.
  const inputComponent = React.useRef<HTMLInputElement>(null)

  const handleSearchParticipantRequest = async () => {
    const searchedValue = inputComponent.current?.value
      ? inputComponent.current?.value
      : ''
    setIsSearchingUsingID(true)
    onSearch(searchedValue)
  }

  const handleResetSearch = async () => {
    inputComponent.current!.value = ''
    setIsSearchingUsingID(false)
    onReset()
  }

  useEffect(() => {
    handleResetSearch()
  }, [forceSearchReset])

  return isSearchingForParticipant ? (
    <div className={classes.inputRow}>
      <input
        placeholder={
          isEnrolledById ? "Participant's ID" : "Participant's Phone Number"
        }
        onKeyDown={e => {
          if (e.key === ENTER_KEY) {
            handleSearchParticipantRequest()
          }
        }}
        className={classes.participantIDSearchBar}
        ref={inputComponent}
        style={{
          paddingRight: isSearchingUsingId ? '28px' : '4px',
        }}
        id="participant-search-bar"
      />
      {isSearchingUsingId && (
        <Button
          className={classes.blackXIconButton}
          onClick={handleResetSearch}
          id="clear-participant-search-text-button">
          <img
            src={BlackXIcon}
            className={classes.blackXIcon}
            alt="black-x-icon"></img>
        </Button>
      )}
      <Button
        className={classes.searchIconContainer}
        onClick={handleSearchParticipantRequest}
        id="search-participants-button">
        <img src={WhiteSearchIcon} alt="white-search-icon"></img>
      </Button>
    </div>
  ) : (
    <Button
      className={classes.topButtons}
      onClick={() => {
        setIsSearchingForParticipant(true)
      }}
      id="start-searching-for-participant-button">
      <img
        src={SearchIcon}
        className={classes.buttonImage}
        alt="seach-icon"></img>
      Find Participant
    </Button>
  )
}

export default ParticipantSearch
