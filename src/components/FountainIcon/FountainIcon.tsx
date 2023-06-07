interface FountainIconProps {
  height: number;
}

const FountainIcon: React.FC<FountainIconProps> = ({ height }) => {
  return ( 
    <img src="public/fountain.png" height={`${height}px`} alt="" />
  );
}

export default FountainIcon;