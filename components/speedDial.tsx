import Box from '@mui/material/Box';
import {Delete, NoteAddOutlined} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteArticle, setActionArticle } from '../Models/Articles/ArticleSlice';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

export default function BasicSpeedDial() {
  const state = useSelector((reduxState: RootState) => reduxState);
  const { articles } = state.articles;
  const dispatch = useDispatch();

  const deleteAction = () => {
    dispatch(deleteArticle())
  };
  const createAction = () => {
    dispatch(setActionArticle('create'));
  };

  const actions = [
    { icon: <Delete />, name: 'Eliminar', action: deleteAction},
    { icon: <NoteAddOutlined />, name: 'Nuevo', action: createAction },
  ];

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
    </Box>
  );
}