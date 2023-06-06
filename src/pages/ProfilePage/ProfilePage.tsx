// npm modules
import { useState, useEffect } from 'react'

// services
import * as profileService from '../../services/profileService'


// types
import { Profile } from '../../types/models'

interface ProfileProps {
  profile: Profile | null;
}

const ProfilePage = (props: ProfileProps ): JSX.Element => {
  const { profile } = props;

  return (
    <main>
      <p>{profile?.name}</p>
    </main>
  )
}

export default ProfilePage
