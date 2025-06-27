import { Image, Link } from "@yext/pages-components";
import { useTemplateData } from "src/common/useTemplateData";
import { LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import { ComplexImage, Image as ImageType } from "@yext/types";
import c from "classnames";
import { getBrand } from "src/common/helpers";
import { CarouselProvider, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useBreakpoint } from "src/common/useBreakpoints";
import { MaybeLink } from "../common/MaybeLink";

const LocalPartners = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  if (profile.c_localPartners) {
    return (
      <ErrorBoundaryWithAnalytics name="local-partners">
        <LocalPartnersLayout
          title={profile.c_localPartnersTitle || "Local Partners"}
          partners={profile.c_localPartners}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type LocalPartnersLayoutProps = {
  title?: string;
  partners?: ComplexImage[];
};

const LocalPartnersLayout = (props: LocalPartnersLayoutProps) => {
  const isDesktopBreakpoint = useBreakpoint("md");

  if (!props.partners || props.partners.length <= 0) {
    return null;
  }

  return (
    <div className="LocalPartners">
      <div className="legacy-container">
        <h2
          className={c(
            "Heading Heading--head pb-4 lg:pb-8 text-center text-brand-green-300"
          )}
        >
          {props.title}
        </h2>
        {isDesktopBreakpoint ? (
          <div className="grid grid-cols-2 gap-8">
            {props.partners?.map((partner, idx) => (
              <div className="" key={idx}>
                <LocalPartnerLayout
                  description={partner.description}
                  details={partner.details}
                  clickthroughUrl={partner.clickthroughUrl}
                  image={partner.image}
                  index={idx}
                />
              </div>
            ))}
          </div>
        ) : (
          <CarouselProvider
            naturalSlideWidth={300}
            naturalSlideHeight={500}
            totalSlides={props.partners.length || 0}
            visibleSlides={1.1}
            isIntrinsicHeight={true}
            infinite={true}
          >
            <Slider className="w-[calc(100vw-16px)] -mr-4">
              {props.partners?.map((partner, idx) => (
                <Slide index={idx} key={idx} className="">
                  <LocalPartnerLayout
                    description={partner.description}
                    details={partner.details}
                    clickthroughUrl={partner.clickthroughUrl}
                    image={partner.image}
                    index={idx}
                  />
                </Slide>
              ))}
            </Slider>
          </CarouselProvider>
        )}
      </div>
    </div>
  );
};

type LocalPartnerLayoutProps = {
  description?: string;
  details?: string;
  clickthroughUrl?: string;
  image: ImageType & { alternateText: string };
  index?: number;
};

const LocalPartnerLayout = ({
  description,
  details,
  image,
  clickthroughUrl,
  index,
}: LocalPartnerLayoutProps) => {
  return (
    <div className="LocalPartner border border-brand-gray-300 rounded h-full mr-4 md:m-0 md:flex md:flex-col">
      <div className="border-b border-brand-gray-300 bg-brand-gray-1100 p-4 pb-3">
        {description && (
          <h3 className="text-local text-brand-green-300 uppercase tracking-[1.5px]">
            {description}
          </h3>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:gap-4 items-center p-4 font-secondary md:h-full">
        {image && (
          <div className="h-[125px] w-[125px] mb-4 shrink-0">
            <Image
              className="w-full h-full"
              image={image}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        <div className="flex flex-col w-[calc(100%-32px)]">
          {details && <div className="pb-4">{details}</div>}
          {clickthroughUrl && (
            <MaybeLink
              className="Button Button--secondary md:w-fit"
              href={clickthroughUrl}
              eventName={`cta${index}`}
            >
              Learn More
            </MaybeLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalPartners;
