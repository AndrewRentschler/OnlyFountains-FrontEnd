// import React, { useState } from "react";
import { useRef } from "react";

//types
import { Fountain } from "../../types/models";
// import { Profile } from "../../types/models";
// import { RatingFormData } from "../../types/forms";

//mui
import { Slider } from "@mui/material";

interface RatingProps {
  fountain: Fountain;
  handleRatingSubmit: (fountainId: number, rating: number) => void;
}


const Rating = (props: RatingProps) => {
  console.log(props);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: Event, value: number | number[]): void => {
    // console.log(event, "event", value, "value");
    const ratingValue = Array.isArray(value) ? value[0] : value;
    const intValue = typeof ratingValue === 'number' ? Math.round(ratingValue) : 0;
    props.handleRatingSubmit(props.fountain.id, intValue);
  };
  
  

  return (
    <section>
      <Slider
        aria-label="Rating"
        defaultValue={3}
        getAriaValueText={(value) => `${value}`}
        valueLabelDisplay="auto"
        onChange={handleChange}
        step={1}
        min={1}
        max={5}
        className="ratingSlider"
        ref={sliderRef}
      />
    </section>
  );
};









export default Rating;