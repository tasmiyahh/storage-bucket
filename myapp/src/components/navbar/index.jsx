import React, { useContext } from "react"
import { GlobalContext } from "../../context"
import {Link} from "react-router-dom"
import "./index.css"


const NavBar= () =>{

  
   let {state , dispath}= useContext(GlobalContext);
    return(
      <div className="navbar">
          <h2>THE SHOP</h2>
      <nav className='nav'>
       
      
      
        <ul>
      
        <li><Link to="/">Home</Link></li>
        
          <li><Link to="/signup">Signup</Link></li>
          <li>
            <Link to="/products">products</Link>
          </li>
        </ul>
      </nav>
      </div>
    )
  }

  export default NavBar;