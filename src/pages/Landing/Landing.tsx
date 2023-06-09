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
    <main>
      <FountainIcon height={32} />
      <h1>{!user?'Please Login to Rate Cold Fountains in Your Area':''}</h1>
      <Map user={user}/>
    </main>
  )
}

export default Landing
