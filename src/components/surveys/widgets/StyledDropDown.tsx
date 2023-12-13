import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone'
import {OutlinedInput, Select, SelectProps, styled} from '@mui/material'
import {SvgIconProps} from '@mui/material/SvgIcon'

const getBgColor = (mode: 'light' | 'dark' = 'dark', isSelected?: boolean) => {
  if (!isSelected) {
    return mode === 'light' ? '#FFF' : '#FFF;'
  }
  return mode === 'light' ? '#F2F2F2' : '#F1F3F5;'
}
const getColor = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light' ? '#4D4D4D' : '#353A3F'
}

const getSvgColor = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light'
    ? {color: '#4D4D4D'}
    : {
        color: '#878E95',
      }
}

const getMenuProps = (mode: 'light' | 'dark' = 'dark', width: string, height: string) => {
  return {
    PaperProps: {
      sx: {
        //  width: '200px',
        borderRadius: 0,
        '& ul': {
          padding: 0,
          width: `${width}`,
          '& li.MuiButtonBase-root': {
            height: height,
            backgroundColor: getBgColor(mode),
            paddingLeft: '0',

            color: getColor(mode),
            '& svg, img ': getSvgColor(mode),
          },
          '& li.MuiButtonBase-root.Mui-selected': {
            backgroundColor: getBgColor(mode),
          },
          '& li.MuiButtonBase-root:hover': {
            backgroundColor: mode === 'light' ? '#ececec' : '#F1F3F5',
          },
        },
      },
    },
  }
}

function Caret(props: SvgIconProps) {
  return <KeyboardArrowUpTwoToneIcon {...props} />
}
function CaretBlack(props: SvgIconProps) {
  return <KeyboardArrowUpTwoToneIcon {...props} />
}

export const StyledDropDown = styled(
  (
    props: SelectProps & {
      width: string
      height?: string
      mode?: 'light' | 'dark'
    }
  ) => (
    <Select
      displayEmpty
      IconComponent={props.mode === 'light' ? CaretBlack : Caret}
      input={<OutlinedInput />}
      MenuProps={getMenuProps(props.mode, props.width, props.height || '48px')}
      {...props}
    />
  ),
  {label: 'StyledDropDown'}
)<{width: string; height: string; mode?: 'light' | 'dark'}>(({theme, width, height, mode = 'dark'}) => ({
  width: width,
  height: height,
  //'& ul': {padding: '0'},

  '& .MuiSvgIcon-root': {
    //top: 'calc(50% + 0.2em)',
    right: '13px',
    '&.MuiSelect-iconOpen': {
      // top: 'calc(50% - 0.8em)',
    },
  },
  '& fieldset': {
    border: mode === 'light' ? 'none' : 'inherit',
    boxShadow: mode === 'light' ? '1px 2px 3px rgba(42, 42, 42, 0.1)' : 'none',
  },

  '& .MuiOutlinedInput-input.MuiInputBase-input': {
    padding: 0,
    backgroundColor: getBgColor(mode, true),
    height: height,
    color: getColor(mode),

    borderRadius: 0,
    fontWeight: 500,
    fontSize: '14px',
    '&> svg, img': {
      flexShrink: 0,
      flexGrow: 0,
      stroke: getColor(mode),
      maxWidth: theme.spacing(6),
      maxHeight: theme.spacing(6),
      '& *': {
        color: getColor(mode),
        stroke: getColor(mode),
      },
    },
    '&>div >div': {
      color: getColor(mode),

      fontWeight: 500,
      fontSize: '14px',
    },
  },
}))

export const StyledDropDownItem = styled('div', {
  label: 'StyledSelectItem',
})<{
  mode?: 'light' | 'dark'
}>(({theme, mode = 'dark'}) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',

  '> svg, img': {
    ...getSvgColor(mode),
    flexShrink: 0,
    flexGrow: 0,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    maxWidth: theme.spacing(6),
    maxHeight: theme.spacing(6),

    // WebkitFilter: mode === 'light' ? '' : 'invert(1)',
    // filter: mode === 'light' ? '' : 'invert(1)',
  },
  '> div': {
    color: getColor(mode),
    //  fontFamily: poppinsFont,
    fontWeight: 500,
    fontSize: '14px',
  },
}))
