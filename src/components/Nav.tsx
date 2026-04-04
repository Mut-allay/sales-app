import { FC } from 'react'
import { NavLink } from 'react-router-dom'

const Nav: FC = () => {
  return (
    <nav className="app-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
        Invoice
      </NavLink>
      <NavLink to="/quotation" className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
        Quotation
      </NavLink>
      <NavLink to="/receipt" className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
        Receipt
      </NavLink>
      <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
        Contacts
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
        History
      </NavLink>
    </nav>
  )
}

export default Nav
