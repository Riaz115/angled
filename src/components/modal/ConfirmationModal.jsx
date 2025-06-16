import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ConfirmationModal = ({ isOpen, onClose, onDelete, userName }) => {
  console.log(isOpen, "this is Open modal for show modal");

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="confirmation-dialog" maxWidth="xs" fullWidth>
      <DialogTitle id="confirmation-dialog" className="text-gray-800 font-semibold">
        Confirm Deletion
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Are you sure you want to delete <span className="font-bold">{userName}</span>? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={onDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
