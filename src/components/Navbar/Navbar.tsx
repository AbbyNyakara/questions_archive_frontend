// import { Link, NavLink } from 'react-router-dom'
import logo from '/Assets/logo.png'
import './navbar.css'

const Navbar = () => {
  // const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  //   textDecoration: isActive ? 'underline' : 'none',
  // })
  return (
    <nav className='navbar'>
      <div className='container'>
        <div className='logo'>
          <img src={logo} alt='Afrobarometerlogo' />
        </div>
        <p>Questions Archive</p>
        <ul className='nav-links'>
          {/* <Link to='/'>General Questions</Link> */}
          <li>General Questions</li>
          <li>Country-Specific Questions</li>
          <li>Profile</li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
