import {OutlinedInput, Select, SelectProps, styled} from '@mui/material'
import SvgIcon, {SvgIconProps} from '@mui/material/SvgIcon'
import {poppinsFont} from '@style/theme'

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

//props example

export const StyledDropDown = styled(
  (props: SelectProps) => (
    <Select
      displayEmpty
      IconComponent={Caret}
      input={<OutlinedInput />}
      MenuProps={MenuProps}
      {...props}
    />
  ),
  {label: 'StyledDropDown'}
)<{width: string; height: string}>(({theme, width, height}) => ({
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
  '& .MuiOutlinedInput-input.MuiInputBase-input': {
    padding: 0,
    backgroundColor: '#565656',
    color: '#fff',
    fontFamily: poppinsFont,
    borderRadius: 0,
    fontWeight: 500,
    fontSize: '14px',
    '&> svg, img': {
      flexShrink: 0,
      flexGrow: 0,
      stroke: '#fff',
      maxWidth: theme.spacing(6),
      maxHeight: theme.spacing(6),
      '& *': {
        color: '#fff',
        stroke: '#fff',
      },
    },
    '&>div >div': {
      color: '#fff',
      fontFamily: poppinsFont,
      fontWeight: 500,
      fontSize: '14px',
    },
  },
}))

export const StyledDropDownItem = styled('div', {
  label: 'StyledSelectItem',
})<{
  width: string
}>(({theme, width}) => ({
  height: theme.spacing(6),
  width: width,

  display: 'flex',
  alignItems: 'center',

  '> svg, img': {
    flexShrink: 0,
    flexGrow: 0,
    maxWidth: theme.spacing(6),
    maxHeight: theme.spacing(6),
    WebkitFilter: 'invert(1)',
    filter: 'invert(1)',
  },
  '> div': {
    color: '#fff',
    fontFamily: poppinsFont,
    fontWeight: 500,
    fontSize: '14px',
  },
}))
