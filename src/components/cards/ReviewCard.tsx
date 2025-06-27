import type { ReviewProfile } from "src/types/entities";
import { useTemplateData } from "src/common/useTemplateData";
import ReviewStars from "src/components/entity/ReviewStars";

type ReviewCardProps = {
  review: ReviewProfile;
  name: string;
};

const ReviewCard = (props: ReviewCardProps) => {
  const { review, name } = props;

  const { document } = useTemplateData();
  const formateDate = (date: string) =>
    new Date(date).toLocaleDateString(document.locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="flex flex-col font-secondary">
      <div className="flex flex-col sm:flex-row bg-brand-gray-300 p-4 md:py-[30px] md:px-[50px]">
        <div className="sm:basis-1/3 md:basis-1/4 sm:shrink-0">
          <div className="font-bold mb-2">{review.authorName}</div>
          <div>{formateDate(review.reviewDate)}</div>
        </div>
        <div>
          <div className="flex mb-2">
            <span className="font-bold mr-3">{review.rating} out of 5.0</span>
            <ReviewStars rating={review.rating} />
          </div>
          <div>{review.content}</div>
        </div>
      </div>
      {review.comments
        ? [0] && (
            <div className="mt-6 sm:ml-[160px] md:ml-[240px] pl-6 border-solid border-l-2 border-brand-green-300">
              <div className="font-bold mb-1">{`Response from ${name}`}</div>
              <div className="mb-4 sm:mb-2">
                {formateDate(review.comments[0].commentDate)}
              </div>
              <div>{review.comments[0].content}</div>
            </div>
          )
        : null}
    </div>
  );
};

export default ReviewCard;
