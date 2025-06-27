import { FaStarHalfAlt, FaStar, FaRegStar } from "react-icons/fa";
import {
  MdOutlineStarHalf,
  MdOutlineStarOutline,
  MdOutlineStarPurple500,
} from "react-icons/md";
import c from "classnames";
import classNames from "classnames";

interface ReviewStarsProps {
  rating: number;
  className?: string;
  maxRating?: number;
}

const ReviewStars = (props: ReviewStarsProps) => {
  const { className, maxRating = 5, rating } = props;

  return (
    <div className={c("flex items-center", className)}>
      {new Array(maxRating)
        .fill(null)
        .map((_, i) =>
          rating - i >= 0.75 ? (
            <MdOutlineStarPurple500
              key={i}
              size={16}
              className={classNames({ "mr-2": i < 4 })}
            />
          ) : rating - i >= 0.25 ? (
            <MdOutlineStarHalf
              key={i}
              size={16}
              className={classNames({ "mr-2": i < 4 })}
            />
          ) : (
            <MdOutlineStarOutline
              key={i}
              size={16}
              className={classNames({ "mr-2": i < 4 })}
            />
          )
        )}
    </div>
  );
};

export default ReviewStars;
