import { Image } from "@yext/pages-components";
import { MaybeLink } from "src/components/common/MaybeLink";
import type { ComplexImage as ComplexImageType } from "@yext/types";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Dot,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import c from "classnames";
import { useTemplateData } from "src/common/useTemplateData";
import { LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import classNames from "classnames";

type GalleryProps = {
  hideArrows?: boolean;
  hideNav?: boolean;
};

const Gallery = (props: GalleryProps) => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;
  const gallery = profile.c_promotionCarouselList;

  if (gallery) {
    return (
      <ErrorBoundaryWithAnalytics name="gallery">
        <GalleryLayout
          images={gallery}
          hideArrows={props.hideArrows}
          hideNav={props.hideNav}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type GalleryLayoutProps = GalleryProps & {
  images: ComplexImageType[];
  title?: string;
};

const GalleryLayout = (props: GalleryLayoutProps) => {
  const arrowSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      viewBox="0 0 16 17"
    >
      <path
        d="M4.20801 8.52536C4.20801 8.38136 4.27201 8.23736 4.36801 8.14136L10.864 1.67736C11.072 1.45336 11.408 1.45336 11.632 1.64536C11.856 1.85336 11.856 2.18936 11.664 2.41336C11.664 2.42936 11.648 2.42936 11.632 2.44536L5.52001 8.57336L11.68 14.7174C11.84 14.9734 11.744 15.3094 11.488 15.4694C11.312 15.5814 11.072 15.5654 10.912 15.4534L4.36801 8.90936C4.27201 8.81336 4.20801 8.66936 4.20801 8.52536Z"
        fill="currentColor"
      />
    </svg>
  );
  const showControls = props.images.length > 1;

  return (
    <div
      className={classNames(
        "Gallery bg-employment-image",
        { "py-8 sm:py-16": props.images.length == 1 },
        { "py-8 sm:pt-16 sm:pb-8": props.images.length != 1 }
      )}
    >
      <div className="legacy-container">
        {props.title && (
          <h2 className="Heading Heading--head text-center mb-8">
            {props.title}
          </h2>
        )}

        <CarouselProvider
          className="relative"
          naturalSlideWidth={100} // Sets fixed aspect ratio for slides, required but disabled with `isIntrensicHeight`
          naturalSlideHeight={100} // Sets fixed aspect ratio for slides, required but disabled with `isIntrensicHeight`
          totalSlides={props.images.length}
          isIntrinsicHeight={true}
        >
          <Slider>
            {props.images.map((image, idx) => (
              <Slide index={idx} key={idx}>
                <MaybeLink
                  className="w-full h-full m-auto"
                  href={image.clickthroughUrl}
                >
                  <Image className="w-full h-full object-cover" image={image} />
                </MaybeLink>
              </Slide>
            ))}
          </Slider>

          {showControls && (
            <div className="flex align-center mt-8 h-6">
              {!props.hideNav && (
                <div
                  className={c("flex justify-center w-full", {
                    "mx-7 sm:mx-0": !props.hideArrows,
                  })}
                >
                  <div className="flex justify-center items-center bg-brand-gray-600 rounded-full">
                    <ButtonBack className="w-6 h-6 sm:w-10 sm:h-10 text-white disabled:opacity-50 disabled:cursor-default">
                      {arrowSVG}
                    </ButtonBack>
                    {props.images.map((_, idx) => {
                      const afterStyles =
                        "after:content-[' '] after:py-2 after:block after:relative after:-top-1";
                      return (
                        <Dot
                          slide={idx}
                          key={idx}
                          className={`mx-2 w-[10px] h-[10px] rounded-full bg-white disabled:opacity-50 disabled:cursor-default ${afterStyles}`}
                        ></Dot>
                      );
                    })}
                    <ButtonNext className="w-6 h-6 sm:w-10 sm:h-10 rotate-180 text-white disabled:opacity-50 disabled:cursor-default">
                      {arrowSVG}
                    </ButtonNext>
                  </div>
                </div>
              )}
            </div>
          )}
        </CarouselProvider>
      </div>
    </div>
  );
};

export default Gallery;
