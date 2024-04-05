import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    isLoading: true,
    renderProfileFailed: false,
    renderJobsFailed: false,
    jobSearchInput: '',
    jobsList: [],
    salaryFilter: '',
    employmentType: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const data = await fetch(url, options)
    const response = await data.json()
    console.log(data.status)
    if (data.ok === true) {
      const formattedResponse = each => ({
        name: each.name,
        profileImageUrl: each.profile_image_url,
        shortBio: each.short_bio,
      })
      const formattedProfile = formattedResponse(response.profile_details)
      this.setState({
        profileDetails: response.profile_details,
        isLoading: false,
      })
    } else {
      this.setState({renderProfileFailed: true, isLoading: false})
    }
  }

  getJobsList = async () => {
    const {employmentType, jobSearchInput, salaryFilter} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryFilter}&search=${jobSearchInput}`
    console.log(url)
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const data = await fetch(url, options)
    const response = await data.json()
    console.log(data.status)

    if (data.ok === true) {
      const camelCase = each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      })
      const formattedResponse = response.jobs.map(each => camelCase(each))
      this.setState({jobsList: formattedResponse, isLoading: false})
    } else {
      this.setState({isLoading: false, renderJobsFailed: true})
    }
  }

  onChecked = event => {
    const {employmentType} = this.state
    if (event.target.checked === true) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getJobsList,
      )
    }
  }

  onSelectSalary = event => {
    this.setState({salaryFilter: event.target.value}, this.getJobsList)
  }

  onChangeSearchInput = event => {
    const {jobsList} = this.state

    this.setState({jobSearchInput: event.target.value})
  }

  onClickSearchIcon = event => {
    const {jobSearchInput, jobsList} = this.state
    const filteredList = jobsList.filter(each =>
      each.title.toLowerCase().includes(event.target.value),
    )
    this.setState({jobsList: filteredList}, this.getJobsList)
    console.log(jobSearchInput)
  }

  renderNoJobView = () => (
    <>
      <img
        src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
        alt='no jobs'
        className='nojob-img'
      />
      <h2 className='nojob-title'>No Jobs Found</h2>
      <p className='nojob-para'>
        We could not find any jobs. Try other filters.
      </p>
    </>
  )

  renderEmploymentFilters = () => (
    <div className='filters-cont'>
      <hr />
      <h2 className='filter-head'>Type of Employment</h2>
      <ul className='filters-cont'>
        {employmentTypesList.map(each => (
          <li className='checkbox-cont' key={each.employmentTypeId}>
            <input
              type='checkbox'
              id={each.employmentTypeId}
              value={each.employmentTypeId}
              onChange={this.onChecked}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryFilters = () => (
    <div className='filters-cont'>
      <hr />
      <h2 className='filter-head'>Salary Range</h2>
      <ul className='filters-cont'>
        {salaryRangesList.map(each => (
          <li className='checkbox-cont' key={each.salaryRangeId}>
            <input
              type='radio'
              name='salary'
              id={each.salaryRangeId}
              value={each.salaryRangeId}
              onChange={this.onSelectSalary}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderFailedProfileView = () => (
    <button
      className='logout-button'
      type='button'
      onClick={this.getProfileDetails}
    >
      Retry
    </button>
  )

  renderProfile = () => {
    const {profileDetails, renderProfileFailed} = this.state

    return renderProfileFailed ? (
      this.renderFailedProfileView()
    ) : (
      <div className='profile-details-cont'>
        <img
          src={profileDetails.profileImageUrl}
          alt={profileDetails.name}
          className='profile-pic'
        />
        <h2 className='profile-name'>{profileDetails.name}</h2>
        <p className='profile-para'>{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

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

  renderJobList = () => {
    const {isLoading, renderJobsFailed, jobsList} = this.state

    if (isLoading) {
      return this.renderLoader()
    }

    if (renderJobsFailed) {
      return this.renderFailedJobsView()
    }

    if (jobsList.length === 0) {
      return this.renderNoJobView()
    }

    return jobsList.map(each => <JobItem key={each.id} jobItemDetails={each} />)
  }

  render() {
    const {
      isLoading,
      profileDetails,
      renderProfileFailed,
      renderJobsFailed,
      jobSearchInput,
      jobsList,
    } = this.state

    return (
      <div className='jobs-main-cont'>
        <Header />

        <div className='bottom-cont'>
          <div className='left-cont'>
            {isLoading ? this.renderLoader() : this.renderProfile()}
            {this.renderEmploymentFilters()}
            {this.renderSalaryFilters()}
          </div>
          <div className='right-cont'>
            <div className='searchbar-cont'>
              <input
                type='search'
                value={jobSearchInput}
                placeholder='Search'
                onChange={this.onChangeSearchInput}
                className='search-input'
              />
              <button
                type='button'
                onClick={this.onClickSearchIcon}
                className='search-button'
                data-testid='searchButton'
                aria-label='search'
              >
                <FaSearch />
              </button>
            </div>
            (<ul className='jobslist-cont'>{this.renderJobList()}</ul>)
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
