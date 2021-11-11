import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DialogContentText } from '@mui/material';
import { Button } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type ConfirmationProps = {
  open: boolean;
  onClose: (accept: boolean) => void;
  acceptText: string;
  cancelText?: string;
  noCancelButton?: boolean;
  message: string;
};

export default function ConfirmationDialog(props: ConfirmationProps) {
  const { open, onClose, noCancelButton, cancelText, acceptText, message } = props;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Confirmacion"}</DialogTitle>
      <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        {message}
      </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!noCancelButton && <Button variant='contained' onClick={() => onClose(false)}>{cancelText || 'Cancelar'}</Button>}
        <Button color='primary' variant='contained' onClick={() => onClose(true)}>{acceptText}</Button>
      </DialogActions>
    </Dialog>
  );
}