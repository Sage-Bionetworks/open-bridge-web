import {OutlinedInput, Select, SelectProps, styled} from '@mui/material'
import SvgIcon, {SvgIconProps} from '@mui/material/SvgIcon'
import {poppinsFont} from '@style/theme'

const getBgColor = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light' ? '#F2F2F2' : '#565656'
}
const getColor = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light' ? '#4D4D4D' : '#fff'
}

const getSvgFilter = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light'
    ? {}
    : {
        WebkitFilter: 'invert(1)',
        filter: 'invert(1)',
      }
}

const getMenuProps = (mode: 'light' | 'dark' = 'dark') => {
  return {
    PaperProps: {
      sx: {
        //  width: '200px',
        borderRadius: 0,
        '& ul': {
          padding: 0,
          '& li.MuiButtonBase-root': {
            backgroundColor: getBgColor(mode),
            paddingLeft: '0',

            color: getColor(mode),
            '& svg, img ': getSvgFilter(mode),
          },
          '& li.MuiButtonBase-root.Mui-selected': {
            backgroundColor: getBgColor(mode),
          },
          '& li.MuiButtonBase-root:hover': {
            backgroundColor: mode === 'light' ? '#ececec' : '#6e6b6b',
          },
        },
      },
    },
  }
}

function Caret(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M1 1L8 8L15 1"
        stroke="white"
        width="16"
        height="16"
        fill="none"
      />
    </SvgIcon>
  )
}
function CaretBlack(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M1 1L8 8L15 1"
        stroke="#4d4d4d"
        width="16"
        height="16"
        fill="none"
      />
    </SvgIcon>
  )
}
/*
const MenuProps = {
  PaperProps: {
    sx: {
      //  width: '200px',
      borderRadius: 0,
      '& ul': {
        padding: 0,
        '& li.MuiButtonBase-root': {
          backgroundColor: '#565656',
          paddingLeft: '0',

          color: '#fff',
          '& svg, img ': {
            WebkitFilter: 'invert(1)',
            filter: 'invert(1)',
          },
        },
        '& li.MuiButtonBase-root.Mui-selected': {
          backgroundColor: '#565656',
        },
        '& li.MuiButtonBase-root:hover': {
          backgroundColor: '#6e6b6b',
        },
      },
    },
  },
}

const MenuPropsLight = {
  PaperProps: {
    sx: {
      //  width: '200px',
      borderRadius: 0,
      '& ul': {
        padding: 0,
        '& li.MuiButtonBase-root': {
          backgroundColor: '#F2F2F2',
          paddingLeft: '0',

          color: '#4D4D4D',
        },
        '& li.MuiButtonBase-root.Mui-selected': {
          backgroundColor: '#F2F2F2',
        },
        '& li.MuiButtonBase-root:hover': {
          backgroundColor: '#F2F2F2',
        },
      },
    },
  },
}
*/
//props example

export const StyledDropDown = styled(
  (
    props: SelectProps & {
      width: string
      height: string
      mode?: 'light' | 'dark'
    }
  ) => (
    <Select
      displayEmpty
      IconComponent={props.mode === 'light' ? CaretBlack : Caret}
      input={<OutlinedInput />}
      MenuProps={getMenuProps(props.mode)}
      {...props}
    />
  ),
  {label: 'StyledDropDown'}
)<{width: string; height: string; mode?: 'light' | 'dark'}>(
  ({theme, width, height, mode = 'dark'}) => ({
    width: width,
    height: height,
    '& ul': {padding: '0'},

    '& .MuiSvgIcon-root': {
      top: 'calc(50% - 0.2em)',
      '&.MuiSelect-iconOpen': {
        top: 'calc(50% - 0.8em)',
        right: '13px',
      },
    },
    '& fieldset': {
      border: mode === 'light' ? 'none' : 'inherit',
      boxShadow:
        mode === 'light' ? '1px 2px 3px rgba(42, 42, 42, 0.1)' : 'none',
    },

    '& .MuiOutlinedInput-input.MuiInputBase-input': {
      padding: 0,
      backgroundColor: getBgColor(mode),
      height: height,
      color: mode === 'light' ? '#4D4D4D' : '#fff',
      fontFamily: poppinsFont,
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
        fontFamily: poppinsFont,
        fontWeight: 500,
        fontSize: '14px',
      },
    },
  })
)

export const StyledDropDownItem = styled('div', {
  label: 'StyledSelectItem',
})<{
  width: string
  height?: string
  mode?: 'light' | 'dark'
}>(({theme, width, mode = 'dark', height = '48px'}) => ({
  height: height,
  width: width,

  display: 'flex',
  alignItems: 'center',

  '> svg, img': {
    flexShrink: 0,
    flexGrow: 0,
    maxWidth: theme.spacing(6),
    maxHeight: theme.spacing(6),
    WebkitFilter: mode == 'light' ? '' : 'invert(1)',
    filter: mode == 'light' ? '' : 'invert(1)',
  },
  '> div': {
    color: getColor(mode),
    fontFamily: poppinsFont,
    fontWeight: 500,
    fontSize: '14px',
  },
}))
