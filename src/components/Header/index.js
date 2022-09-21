import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
    const {pathname} = useLocation();
    
  return (
    <div className='header'>
        <h1 className='card-header'>DEX</h1>
        <Link to={pathname === '/stats' ? '/' : '/stats'}>
            <button>
                {pathname === '/stats' ? 'Go Back' : 'View Stats'}
            </button>
        </Link>
    </div>
  )
}

export default Header