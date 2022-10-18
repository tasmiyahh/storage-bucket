import React, { useContext } from "react"
import { GlobalContext } from "../../context"
import {Link} from "react-router-dom"
import "./index.css"


const NavBar= () =>{

  
   let {state , dispath}= useContext(GlobalContext);
    return(
      <>
      <nav className='nav'>
       
      
      
        <ul>
          
         
          <li><Link to="/signup">Signup</Link></li>
          <li>
            <Link to="/products">products</Link>
          </li>
        </ul>
      </nav>
      </>
    )
  }

  export default NavBar;