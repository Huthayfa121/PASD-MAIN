import { BrowserRouter, Routes, Route} from 'react-router-dom';
//import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import ImageSlider from './Components/ImageSlider'
import Architects from './Components/DataManagement/Architects/Architects';
import ShowBuildings from './Components/DataManagement/Buildings/ShowBuildings';
import Cities from './Components/DataManagement/City/Cities';
import Notaries from './Components/DataManagement/Notary/Notaries';
import Owners from './Components/DataManagement/Owners/Owners';
import Tenants from './Components/DataManagement/Tenant/Tenant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/ImageSlider' element={<ImageSlider />}></Route>
        <Route path='/Architects' element={<Architects />}></Route>
        <Route path='/ShowBuildings' element={<ShowBuildings />}></Route>
        <Route path='/Cities' element={<Cities />}></Route>
        <Route path='/Notaries' element={<Notaries />}></Route>
        <Route path='/Owners' element={<Owners />}></Route>
        <Route path='/Tenants' element={<Tenants />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
