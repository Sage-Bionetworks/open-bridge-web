import React, { FunctionComponent } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'

import clsx from 'clsx'
import { Study } from '../../types/types'
import { ThemeType } from '../../style/theme'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Box, IconButton, Menu, MenuItem } from '@material-ui/core'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    width: '253px',
    height: '188px',
    border: '1px solid gray',

  },

  title: {
    fontSize: 14,
    color: theme.testColor,
  },
  pos: {
    marginBottom: 12,
  },
}))

type StudyCardOwnProps = {
  study: Study
}

type StudyCardProps = StudyCardOwnProps

const StudyCard: FunctionComponent<StudyCardProps> = ({ study }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  // const bull = <span className={classes.bullet}>•</span>

  //console.log('className', className)

  return (
    <Card className={classes.root}>
      <Box display="flex" textAlign="left" paddingTop="8px">
      <IconButton style={{padding: '0'}} onClick={e => {e.stopPropagation(); e.preventDefault(); setAnchorEl(e.currentTarget)}}>
          <MoreVertIcon />
        </IconButton>
        {study.status}
       
        </Box>
      <CardContent>
        
      
        <Typography variant="h6" color="textSecondary" gutterBottom >
          {study.name}
        </Typography>
        <Typography className={classes.title} color="textSecondary">
          {study.description}
        </Typography>
      </CardContent>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View</MenuItem>
        <MenuItem onClick={handleMenuClose}>Duplicate study</MenuItem>
        <MenuItem onClick={handleMenuClose}>Rename study</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete study</MenuItem>
        <MenuItem onClick={handleMenuClose}>Create version</MenuItem>
       
        
       
        
        

      </Menu>
    </Card>
  )
}

export default StudyCard
