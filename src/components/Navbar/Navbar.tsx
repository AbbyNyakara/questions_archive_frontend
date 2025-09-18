import { NavLink } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
  return (
    <header className='nav-header'>
      <div className='nav-container'>
        <h1 className='site-title'>Questions Library</h1>
        <nav className='main-nav'>
          <ul className='nav-menu'>
            <li className='nav-item'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                <i className='fas fa-info-circle'></i>About
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/main-questionnaire'
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                <i className='fas fa-clipboard-list'></i>Master Questionnaire
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/csqs'
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                <i className='fas fa-globe-americas'></i>Country-Specific
                Questions
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/saved'
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                <i className='fas fa-bookmark'></i>Saved
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/api'
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                <i className='fas fa-database'></i>API Platform
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
