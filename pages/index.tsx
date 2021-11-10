import type { NextPage } from 'next'
import Container from '../components/container'
import DataTable from '../components/dataTable'
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import BasicSpeedDial from '../components/speedDial';

const Home: NextPage = () => {
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];
  
  return (
    <Container name='Home'>
      <DataTable />
      <BasicSpeedDial/>
    </Container>
  )
}

export default Home
