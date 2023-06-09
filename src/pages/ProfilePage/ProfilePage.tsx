// types
import { Profile } from '../../types/models'

interface ProfileProps {
  profile: Profile | null;
}

const ProfilePage = (props: ProfileProps ): JSX.Element => {
  const { profile } = props;

  return (
    <main className='profile_page'>
      <h1>Profile Page</h1>
      <img src={profile?.photo} alt="" />
      <p>{profile?.name}</p>
    </main>
  )
}

export default ProfilePage
