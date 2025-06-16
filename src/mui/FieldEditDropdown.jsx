import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';


import EditIcon from '@mui/icons-material/Edit';



export const UserMenuOptions = ({ onDelete, onSelectDefaultAgency, onEdit,role }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    try {
      
      event.stopPropagation()
    } catch (error) {
      
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  const handleDefault = () => {
    onSelectDefaultAgency();
    handleClose();
  };

  const handleEdit = () => {
    onEdit();
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon  />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete}>
          <DeleteIcon />
          Delete
        </MenuItem>
       {role=="AG"&& <MenuItem onClick={handleDefault}>
          <FileCopyIcon />
          Default Agency
        </MenuItem>}
        <MenuItem onClick={handleEdit}>
          <EditIcon />
          Edit
        </MenuItem>
      </Menu>
    </div>
  );
};

