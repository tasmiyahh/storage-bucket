import Product from "./components/products/index.jsx";
import Signup from "./components/signup/index.jsx";
import NavBar from './components/navbar';
import Home from "./components/home/index.jsx";

import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from "react-router-dom";


const App = ()=>{
return(
  <div className="app">

    <div>
    <Router>
       <NavBar/>

      <Routes>
      <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Product/>}/>
        <Route path='/signup' element={<Signup/>} />
      
      </Routes>
     </Router>
    </div>
    

  </div>
)


}


export default App;