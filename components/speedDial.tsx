import Box from '@mui/material/Box';
import {Delete, NoteAddOutlined} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteArticle, setActionArticle } from '../Models/Articles/ArticleSlice';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ConfirmationDialog from './ConfirmationDialog';
import { useState } from 'react';

export default function BasicSpeedDial() {
  const state = useSelector((reduxState: RootState) => reduxState);
  const { selectedArticles } = state.articles;
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const deleteAction = () => {
    setOpenDialog(true)
  };
  const createAction = () => {
    dispatch(setActionArticle('create'));
  };

  const actions = [
    { icon: <Delete />, name: 'Eliminar', action: deleteAction},
    { icon: <NoteAddOutlined />, name: 'Nuevo', action: createAction },
  ];

  const handleOnCloseDialog = (accept: boolean) => {
    if (accept) dispatch(deleteArticle());
    setOpenDialog(false)
  }
  return (
    <Box sx={{ height: 100, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic speedDial"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.action}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
      <ConfirmationDialog 
        onClose={handleOnCloseDialog} 
        open={openDialog && selectedArticles.length > 0 } 
        acceptText={'Confirmar'} 
        cancelText={'Cancelar'} 
        message={ selectedArticles.length > 1 ?`Desea eliminar los ${selectedArticles.length} articulos seleccionados?.`: 'Desea eliminar articulo seleccionado?'}/>
    </Box>
  );
}