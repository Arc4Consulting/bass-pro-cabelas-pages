import { useEffect, useState } from "react";
import ReviewStars from "src/components/entity/ReviewStars";
import ReviewCard from "src/components/cards/ReviewCard";
import { fetchReviews } from "src/components/entity/utils/fetchReviews";
import { useTemplateData } from "src/common/useTemplateData";
import { LocationProfile, ReviewProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import classNames from "classnames";
import { getBrand } from "src/common/helpers";
import { Link } from "@yext/sites-react-components";

type ReviewsProps = {
  reviews?: ReviewProfile[];
  averageRating?: number;
};

const Reviews = (props: ReviewsProps) => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;
  const reviews = profile.c_reviewsSection;

  // TODO: move reviews API fetching into this template

  return (
    <ErrorBoundaryWithAnalytics name="reviews">
      <ReviewsLayout
        title={reviews?.title}
        name={profile.name}
        entityId={profile.id}
        {...props}
      />
    </ErrorBoundaryWithAnalytics>
  );
};

type ReviewsLayoutProps = ReviewsProps & {
  title?: string;
  name: string;
  entityId: string;
  reviews?: ReviewProfile[];
  averageRating?: number;
};

const ReviewsLayout = (props: ReviewsLayoutProps) => {
  const { name, reviews, averageRating } = props;
  const profile = useTemplateData().document as LocationProfile;

  if (!reviews?.length) {
    return null;
  }

  return (
    <div className="legacy-container" id="Reviews">
      <div className="py-[30px] my-[30px] border-t-2 border-brand-gray-300">
        <div className="mb-12 sm:mb-0">
          <h2
            className={classNames(
              "Heading Heading--secondary mb-5 text-center text-brand-green-300"
            )}
          >
            Recent Google Reviews for {profile.name} {profile.address.city},{" "}
            {profile.address.region}
          </h2>
          {averageRating && (
            <div className="flex justify-center font-secondary flex-wrap">
              <span className="">{averageRating.toFixed(1)} out of 5.0</span>
              <ReviewStars rating={averageRating} className="mx-3" />
              <div className="w-full sm:w-auto flex justify-center">
                <Link className="Link Link--underline" href="#Reviews">
                  (Google Reviews)
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 my-4">
          {reviews?.map((review, idx) => (
            <div className="">
              <ReviewCard key={idx} review={review} name={name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
