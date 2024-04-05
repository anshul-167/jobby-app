import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    this.setState({username: '', password: '', showError: false, errorMsg: ''})
  }

  onSubmitFailure = error => {
    this.setState({showError: true, errorMsg: error})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    }
    if (data.status_code === 400) {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {errorMsg, username, password, showError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-bg-login">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form onSubmit={this.onSubmit}>
            <div className="input-cont">
              <label htmlFor="username">USERNAME</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={this.onChangeUsername}
                className="username"
              />
            </div>
            <div className="input-cont">
              <label htmlFor="pass">PASSWORD</label>
              <input
                id="pass"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.onChangePassword}
                className="username"
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showError ? <p className="error-msg">{`*${errorMsg}`}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
