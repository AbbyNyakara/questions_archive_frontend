import { Link } from 'react-router-dom'
import logo from '/Assets/logo.png'
import './navbar.css'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='container'>
        <div className='logo'>
          <img src={logo} alt='Afrobarometerlogo' />
        </div>
        {/* <p>Questions Archive</p> */}
        <ul className='nav-links'>
          <li>
            <Link to='/'>Master Questionnaire</Link>
          </li>
          <li>
            <Link to='/csq-questions'>Country-Specific Questions</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
