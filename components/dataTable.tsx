import { DataGrid, GridCellParams, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Article } from '../Models/Articles/Article';
import { setSelectedArticles, setToEditArticle } from '../Models/Articles/ArticleSlice';
import { RootState } from '../store';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nombre', width: 130 },
  { field: 'cost', headerName: 'Costo', width: 130 },
  { field: 'price', headerName: 'Precio', width: 130 },
  { field: 'description', headerName: 'Descripcion', width: 330 },
];
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function DataTable() {
  const dispatch = useDispatch();
  const state = useSelector((reduxState: RootState) => reduxState);
  const { articles } = state.articles;

  const handleOnDoubleClick = (params: GridCellParams) => {
    const { row } = params;
    const article = articles.find(art => art.id === row.id);
    dispatch(setToEditArticle(article));
  };

  const formatedRows = articles.map( (article: Article) => { 
    return {
      ...article,
      price: formatter.format(article.price),
      cost: formatter.format(article.cost),
    }; 
  });
  
  const handleOnSelected = (params: GridSelectionModel) => {
    const selectedItems = articles.filter( item => params.includes(item.id));
    dispatch(setSelectedArticles(selectedItems));
  }

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        autoHeight={true}
        rows={formatedRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[25,50]}
        checkboxSelection
        onSelectionModelChange={handleOnSelected}
        onCellDoubleClick={handleOnDoubleClick}
      />
    </div>
  );
}
