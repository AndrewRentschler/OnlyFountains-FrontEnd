import { useState } from "react";
import { useRef } from "react";

//types
import { Fountain } from "../../types/models";
import { Rating } from "../../types/models";
// import { Profile } from "../../types/models";
// import { RatingFormData } from "../../types/forms";
import * as ratingService from "../../services/ratingService";

//mui
import { Slider } from "@mui/material";
import { Button } from "@mui/material";



interface RatingProps {
  fountain: Fountain;
  profileId: number;
}


const RatingComponent = (props: RatingProps) => {
  const fountainId = props.fountain.id;
  const sliderRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState<number>(0);
  const profileId = props.profileId;

  const handleChange = (event: Event, value: number | number[]): void => {
    console.log(event, "event", value, "value");
    const ratingValue = Array.isArray(value) ? value[0] : value;
    const intValue = typeof ratingValue === 'number' ? Math.round(ratingValue) : 0;
    setRating(intValue);
  };

  async function checkRating(fountainId: number, profileId: number) {
    const getAllRatings = await ratingService.getAllRatings();
    const myRating = getAllRatings.find((rating: Rating) => rating.fountainId === fountainId && rating.raterId === profileId);
    console.log(myRating, "myRating");
    return myRating?myRating.value:null;
  }
  const myRating = checkRating(fountainId, profileId);
  

  const submitRating = () => {
    const newRating: Rating = {
      fountainId: props.fountain.id,
      value: rating,
      raterId: profileId?profileId:0
    };
    addRating(newRating);
  }

  async function addRating(newRating: Rating) {
    try {
      const returnedRating = await ratingService.addRating(newRating);
      console.log(returnedRating, "returnedRating");
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  }
  
  return (
    <section>
      <h3>Rate This Fountain</h3>
      <p>{myRating != null ? myRating.toString():"Not yet Rated"}</p>
      <Slider
        aria-label="Rating"
        defaultValue={3}
        getAriaValueText= {(value) => `${value}`}
        valueLabelDisplay="auto"
        onChange={handleChange}
        step={1}
        min={1}
        max={5}
        className="ratingSlider"
        ref={sliderRef}
      />
      <Button onClick={submitRating}>Submit</Button>
    </section>
  );
};

export default RatingComponent;