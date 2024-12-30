import { BrowserRouter, Routes, Route} from 'react-router-dom';
//import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
