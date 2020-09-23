import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}))

type HeaderProps = {
  sections: { name: string; path: string }[]
  title: string
}

const Header: FunctionComponent<HeaderProps> = ({
  sections,
  title,
}: HeaderProps) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Toolbar
        component="nav"
        variant="dense"
        disableGutters
        className={classes.toolbarSecondary}
      >
        {sections.map(section => (
          <Link
            color="inherit"
            noWrap
            key={section.name}
            variant="body2"
            href={section.path}
            className={classes.toolbarLink}
          >
            {section.name}
          </Link>
        ))}

        <Button variant="outlined" size="small">
          Sign up
        </Button>
      </Toolbar>
    </React.Fragment>
  )
}

export default Header
