// css
import styles from './Landing.module.css'

// types
import { User } from '../../types/models'
// import { Coords } from '../../types/models';

import Map from '../../components/Map/Map';
import FountainIcon from '../../components/FountainIcon/FountainIcon';

interface LandingProps {
  user: User | null;
}

const Landing = (props: LandingProps): JSX.Element => {
  const { user } = props;

  return (
    <main className={styles.container}>
      <FountainIcon height={64} />
      <h1>{!user?'Please Login to Find & Rate Cold Fountains in Your Area':''}</h1>
      <Map />
    </main>
  )
}

export default Landing
