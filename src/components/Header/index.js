import {Link, Redirect, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogo = () => {
    console.log('x')
    return <Redirect to="/" />
  }

  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <navbar className="navbar">
      <Link to="/">
        <button type="button" onClick={onClickLogo} className="logo-button">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </button>
      </Link>
      <ul className="tabs-cont">
        <li>
          <Link to="/" className="tab-item">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="tab-item">
            Jobs
          </Link>
        </li>
      </ul>
      <li>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </navbar>
  )
}
export default withRouter(Header)
