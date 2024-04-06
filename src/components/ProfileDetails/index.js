import './index.css'

const ProfileDetails = props => {
  const {profileDetails} = props
  const {name, profileImageUrl, shortBio} = profileDetails

  return (
    <div className="profile-details-cont">
      <img src={profileImageUrl} alt={name} className="profile-pic" />
      <h2 className="profile-name">{name}</h2>
      <p className="profile-para">{shortBio}</p>
    </div>
  )
}
export default ProfileDetails
