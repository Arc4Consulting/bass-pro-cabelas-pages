import type { ReviewProfile, ReviewStreamsResponse } from "src/types/entities";

export const fetchReviews = async (api_key: string, entityId: string) => {
  const vParam = "20240521";
  const params = new URLSearchParams({
    api_key,
    v: vParam,
    "entity.id": entityId,
    limit: "50",
    $sortBy__desc: "reviewDate",
  });
  const aggParams = new URLSearchParams({
    api_key,
    v: vParam,
    "entity.id": entityId,
  });
  let reviews: ReviewProfile[] = [];

  // https://hitchhikers.yext.com/docs/streams/reviews-streams-reference/
  const data: ReviewStreamsResponse = await fetch(
    `https://streams.yext.com/v2/accounts/me/api/reviewsGMB?${params.toString()}`
  )
    .then((resp) => resp.json())
    .catch((error) => console.log(error));

  reviews = reviews.concat(
    data.response.docs.filter((review) => review.content != null)
  );
  let nextPageToken = data.response.nextPageToken;

  while (nextPageToken && reviews.length < 5) {
    const nextResponseTemp = await fetch(
      `https://streams.yext.com/v2/accounts/me/api/reviewsGMB?${params.toString()}&pageToken=${nextPageToken}`
    )
      .then((resp) => resp.json())
      .catch((error) => {
        console.log(error);
        nextPageToken = undefined; //break loop on error
      });
    nextPageToken = nextResponseTemp.response.nextPageToken;
    reviews = reviews.concat(
      nextResponseTemp.response.docs.filter(
        (review: ReviewProfile) => review.content != null
      )
    );
  }

  const reviewsAgg = await fetch(
    `https://streams.yext.com/v2/accounts/me/api/reviewsAggGMB?${aggParams.toString()}`
  )
    .then((resp) => resp.json())
    .catch((error) => console.error(error));

  const averageRating = reviewsAgg?.response?.docs[0].averageRating;
  const count = reviewsAgg?.response?.docs[0].reviewCount;
  return {
    reviews: reviews.slice(0, 5),
    rating: averageRating ?? 0,
    count: count ?? 0,
  };
};
