import {
  makeStyles,
  MenuItem,
  Select,
  SelectProps,
  Box,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'
import {ThemeType} from '../../style/theme'

interface StyleProps {
  width: string //px or %
  itemHeight: string
}
const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  root: props => ({width: props.width}),
  select: props => ({
    height: props.itemHeight,

    border: '1px solid black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    outline: 'none',
    transition: '0.25s ease',
    fontSize: '14px',
    //width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    paddingLeft: theme.spacing(2),
  }),

  optionClass: props => ({
    width: props.width,
    backgroundColor: 'white',
    height: props.itemHeight,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    transition: '0.25s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    cursor: 'pointer',
  }),
  selectMenu: {
    backgroundColor: 'white',
    '&:focus': {
      backgroundColor: 'white',
    },
  },

  listPadding: {
    padding: theme.spacing(0),
  },
  listBorder: {
    borderRadius: '0px',
  },
  input: {
    backgroundColor: 'white',
  },
}))

export interface BlackBorderDropdownStyleProps {
  width: string
  itemHeight?: string
  value: string
  onChange: Function
  dropdown: {value: string; label: string}[]
  emptyValueLabel: string
  isSearchable?: boolean
  searchableOnChange?: Function
}

const SaveBlackBorderDropdown: React.FunctionComponent<
  SelectProps & BlackBorderDropdownStyleProps
> = ({
  value,
  onChange,
  dropdown,
  id,
  emptyValueLabel,
  width,
  itemHeight = '30px',
  isSearchable,
  searchableOnChange,
  ...other
}) => {
  const classes = useStyles({width, itemHeight})
  const selectMenu = (
    <Select
      labelId={id}
      className={classes.root}
      id={id}
      value={value}
      onChange={onChange}
      disableUnderline
      classes={{
        selectMenu: classes.selectMenu,
        root: classes.select,
      }}
      MenuProps={{
        classes: {list: classes.listPadding, paper: classes.listBorder},
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      }}
      displayEmpty>
      <MenuItem value="" disabled style={{display: 'none'}}>
        {emptyValueLabel}
      </MenuItem>
      {dropdown.map((el, index) => (
        <MenuItem
          className={classes.optionClass}
          key={index}
          value={el.value}
          id={`investigator-${index}`}>
          {el.label}
        </MenuItem>
      ))}
    </Select>
  )

  const searchableDropdown = (
    <Autocomplete
      id={id}
      options={dropdown}
      className={classes.root}
      placeholder="hello"
      renderInput={params => (
        <TextField
          className={classes.listPadding}
          {...params}
          label="Participant Time Zone"
          variant="outlined"
        />
      )}
      getOptionLabel={option => option.label}
      classes={{paper: classes.listBorder, input: classes.input}}
      onChange={(event, newValue) => {
        if (!searchableOnChange) return
        searchableOnChange(newValue?.value || '')
      }}
    />
  )

  return <Box>{isSearchable ? searchableDropdown : selectMenu}</Box>
}

export default SaveBlackBorderDropdown
