import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Home extends Component {
  onClickFindJobs = () => {
    const jwtToken = Cookies.get('jwt_token')
    const {history} = this.props
    console.log('j')
    if (jwtToken !== undefined) {
      console.log('k')
      history.replace('/jobs')
    }
  }

  renderHomeComponent = () => (
    <div className="bottom-cont">
      <h1 className="main-head-home">
        Find The Job That Fits
        <br /> Your Life
      </h1>
      <p className="para-home">Millions of people are searching for jobs.</p>
      <Link to="/jobs">
        <button type="button" className="logout-button">
          Find Jobs
        </button>
      </Link>
    </div>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="home-bg">
        <Header />
        {this.renderHomeComponent()}
      </div>
    )
  }
}
export default Home
