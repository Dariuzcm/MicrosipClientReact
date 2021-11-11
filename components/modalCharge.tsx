import { Box, CircularProgress, Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function ModalCharge () {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const state = useSelector((reduxState: RootState) => reduxState);
  const { status } =  state.articles;

  return (
  <Modal
    open={status === 'busy'}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <CircularProgress aria-label={'Cargando...'} />
  </Modal>
  );
}