import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobItemDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItemDetails

  return (
    <Link to={`/jobs/${id}`}>
      <li className="job-item-cont">
        <div className="logo-cont">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="logo-sub-cont">
            <h2 className="job-title">{title}</h2>
            <div className="star-cont">
              <FaStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="package-cont">
          <div className="location-main-cont">
            <div className="location-cont">
              <MdLocationOn className="loc-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="location-cont">
              <BsBriefcaseFill className="loc-icon" />
              <p className="location">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <h3 className="description-head">Description</h3>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
