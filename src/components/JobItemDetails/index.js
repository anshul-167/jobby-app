import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    isLoading: true,
    similarJobs: [],
    renderFailed: false,
  }

  componentDidMount() {
    this.getJobItemData()
  }

  renderFailedJobsView = () => (
    <div>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
        alt='failure view'
      />
      <h2>Oops! Something Went Wrong</h2>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        className='logout-button'
        type='button'
        onClick={this.getJobsList}
      >
        Retry
      </button>
    </div>
  )

  getJobItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const data = await fetch(url, options)
    const response = await data.json()
    if (data.ok === true) {
      const formattedJobDetails = each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        lifeAtCompany: each.life_at_company,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        skills: each.skills,
      })
      const formattedSimilarJobs = response.similar_jobs.map(each =>
        formattedJobDetails(each),
      )
      this.setState({
        jobDetails: formattedJobDetails(response.job_details),
        similarJobs: formattedSimilarJobs,
        isLoading: false,
      })
    } else {
      this.setState({isLoading: false, renderFailed: true})
    }
  }

  renderSimilarCont = () => {
    const {similarJobs} = this.state
    return (
      <>
        <h2>Similar Jobs</h2>
        <ul className='similar-main-cont'>
          {similarJobs.map(each => (
            <li className='job-item-cont' key={each.id}>
              <div className='logo-cont'>
                <img
                  src={each.companyLogoUrl}
                  alt='similar job company logo'
                  className='company-logo'
                />
                <div className='logo-sub-cont'>
                  <h2 className='job-title'>{each.title}</h2>
                  <div className='star-cont'>
                    <FaStar className='star' />
                    <p className='rating'>{each.rating}</p>
                  </div>
                </div>
              </div>

              <h3 className='description-head'>Description</h3>
              <p className='description'>{each.jobDescription}</p>
              <div className='package-cont'>
                <div className='location-main-cont'>
                  <div className='location-cont'>
                    <MdLocationOn className='loc-icon' />
                    <p className='location'>{each.location}</p>
                  </div>
                  <div className='location-cont'>
                    <BsBriefcaseFill className='loc-icon' />
                    <p className='location'>{each.employmentType}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {isLoading, jobDetails, similarJobs, renderFailed} = this.state

    console.log(jobDetails.skills)

    return (
      <div className='job-details-main-cont'>
        <Header />
        {renderFailed ? (
          this.renderFailedJobsView()
        ) : (
          <>
            <div className='blog-container'>
              <div className='job-item-cont'>
                <div className='logo-cont'>
                  <img
                    src={jobDetails.companyLogoUrl}
                    alt='job details company logo'
                    className='company-logo'
                  />
                  <div className='logo-sub-cont'>
                    <h2 className='job-title'>{jobDetails.title}</h2>
                    <div className='star-cont'>
                      <FaStar className='star' />
                      <p className='rating'>{jobDetails.rating}</p>
                    </div>
                  </div>
                </div>
                <div className='package-cont'>
                  <div className='location-main-cont'>
                    <div className='location-cont'>
                      <MdLocationOn className='loc-icon' />
                      <p className='location'>{jobDetails.location}</p>
                    </div>
                    <div className='location-cont'>
                      <BsBriefcaseFill className='loc-icon' />
                      <p className='location'>{jobDetails.employmentType}</p>
                    </div>
                  </div>
                  <p className='package'>{jobDetails.packagePerAnnum}</p>
                </div>
                <hr />
                <div className='link-cont'>
                  <h3 className='description-head'>Description</h3>
                  <a href={jobDetails.companyWebsiteUrl} target='_blank' rel="noreferrer">
                    Visit <FaExternalLinkAlt />
                  </a>
                </div>
                <p className='description'>{jobDetails.jobDescription}</p>
                <h2>Skills</h2>

                <ul className='skills-cont'>
                  {jobDetails.skills &&
                    jobDetails.skills.map(each => (
                      <li className='each-skill-cont' key={each.name}>
                        <img
                          src={each.image_url}
                          alt='{each.name}'
                          className='skill-logo'
                        />
                        <p className='skill-name'>{each.name}</p>
                      </li>
                    ))}
                </ul>
                <h2>Life at Company</h2>
                <div className='life-cont'>
                  <p className='skill-name'>
                    {jobDetails.lifeAtCompany &&
                      jobDetails.lifeAtCompany.description}
                  </p>
                  <img
                    src={
                      jobDetails.lifeAtCompany &&
                      jobDetails.lifeAtCompany.image_url
                    }
                    className='life-img'
                  />
                </div>
              </div>
            </div>
            {this.renderSimilarCont()}
          </>
        )}
      </div>
    )
  }
}

export default JobItemDetails
