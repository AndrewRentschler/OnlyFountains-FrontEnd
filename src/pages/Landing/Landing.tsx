// css
import styles from './Landing.module.css'

// types
import { User } from '../../types/models'
import { Coords } from '../../types/models';

import Map from '../../components/Map/Map';

interface LandingProps {
  user: User | null;
}

const Landing = (props: LandingProps): JSX.Element => {
  const { user } = props

  return (
    <main className={styles.container}>
      <h1>hello, {user ? user.name : 'friend'}</h1>
      <Map defaultLatitude={37.7749} defaultLongitude={-122.4194} />
    </main>
  )
}

export default Landing
