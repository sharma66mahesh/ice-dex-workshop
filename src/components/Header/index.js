import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
    const {pathname} = useLocation();
    
  return (
    <div className='header'>
        <h1 className='card-header'>DEX</h1>
        <button>
          <Link to={pathname === '/stats' ? '/' : '/stats'}>
            {pathname === '/stats' ? 'Go Back' : 'View Stats'}
          </Link>
        </button>
    </div>
  )
}

export default Header