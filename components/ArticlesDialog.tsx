import { Button, DialogActions, DialogContent, DialogTitle, InputLabel, OutlinedInput, Typography } from "@material-ui/core";
import { FormControl, Grid, InputAdornment } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { type } from "os";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Article } from "../Models/Articles/Article";
import { createArticle, setActionArticle, updateArticle } from "../Models/Articles/ArticleSlice";
import { RootState } from "../store";
import theme from "../styles/theme";
import { zfill } from "../utils/utils";


export type ArticleDialogParams = {
  actionType: 'edit' | 'create' | false;
  open: boolean;
  article: Article | null;
}
export default function ArticleDialog(params: ArticleDialogParams) {
  const emptyArticle: Article = {
    id: new Date().getTime(),
    name: '',
    price: 0.00,
    cost: 0.00,
    description: ''
  }
  const titles = {
    edit: 'Editar Articulo',
    create: 'Crear Articulo',
  }
  const { open, actionType, article } = params;
  const state = useSelector((reduxState: RootState) => reduxState);
  const { iva } = state.articles;
  const [ articleCreated, setArticle ] = useState<Article>(article ? article : emptyArticle)
  const dispatch = useDispatch();

  const actions = {
    edit: (values: Article) => {
      dispatch(updateArticle(values))
    },
    create: (values: Article) => dispatch(createArticle(values)),
  }
  const handleOnClose = (accepted: boolean) => {
    if (!accepted){
      dispatch(setActionArticle(false));
      return;
    }
    switch (actionType) {
      case 'edit':
        actions.edit(articleCreated);
        break;
      case 'create':
        actions.create(articleCreated);
        break;
      default:
        break;
    }
    setArticle(emptyArticle)
  }
  const handleChange = (prop: keyof Article) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (prop === 'cost') {
      let value = event.target.value;
      const formattedvalue: number = parseFloat(value);
      const ivaArt = +event.target.value*(iva/100);
      const sum = +ivaArt + +event.target.value;
      setArticle({ 
        ...articleCreated, 
        cost: +formattedvalue.toFixed(2),
        price: +sum.toFixed(2)
      });
    } else if (prop === 'price') {
      let value = event.target.value;
      const formattedvalue: number = parseFloat(value);
      const cost = +event.target.value/(1+ +iva/100)
      setArticle({
        ...articleCreated,
        cost: +cost.toFixed(2),
        [prop]:  +formattedvalue.toFixed(2)
      })
    } else {
      setArticle({ ...articleCreated, [prop]: event.target.value });
    }
  };
  useEffect(() => {
    setArticle(article || emptyArticle);
    return () => {}
  }, [article]);
  return (
    <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      > 
       <DialogContent>
         <Typography variant="subtitle1">{titles[actionType ? actionType : 'create' ]}</Typography>
      </DialogContent>
      <DialogTitle id="alert-dialog-title">
        Articulo
      </DialogTitle>
        <DialogContent>
          <Grid maxWidth={'100%'}>
          <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-name">Nombre</InputLabel>
              <OutlinedInput
                id="outlined-adornment-name"
                value={articleCreated.name}
                onChange={handleChange('name')}
                label="nombre"
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-cost">Costo</InputLabel>
              <OutlinedInput
                id="outlined-adornment-cost"
                value={articleCreated.cost}
                onChange={handleChange('cost')}
                required
                inputProps={{
                  type: 'number',
                  min: '0'
                }}
                startAdornment={<InputAdornment style={{ backgroundColor: theme.palette.grey[200] }} position="start">$</InputAdornment>}
                label="costo"
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-iva">Iva {iva}%</InputLabel>
              <OutlinedInput
                id="outlined-adornment-iva"
                required
                value={(articleCreated.cost * (iva / 100)).toFixed(2)}
                disabled={true}
                startAdornment={<InputAdornment style={{ backgroundColor: theme.palette.grey[200] }} position="start">$</InputAdornment>}
                label="iva 16%"
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-precio">Precio</InputLabel>
              <OutlinedInput
                id="outlined-adornment-precio"
                required
                value={articleCreated.price}
                onChange={handleChange('price')}
                inputProps={{
                  type: 'number',
                  min: '0'
                }}
                startAdornment={<InputAdornment style={{ backgroundColor: theme.palette.grey[200] }} position="start">$</InputAdornment>}
                label="precio"
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-description">Descripción</InputLabel>
              <OutlinedInput
                id="outlined-adornment-description"
                value={articleCreated.description}
                required
                onChange={handleChange('description')}
                multiline
                minRows={3}
                label="description"
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOnClose(false)} variant='contained' >Cancelar</Button>
          <Button onClick={() => handleOnClose(true)} color="primary" variant='contained' autoFocus> Aceptar</Button>
        </DialogActions>
    </Dialog>
  );
}