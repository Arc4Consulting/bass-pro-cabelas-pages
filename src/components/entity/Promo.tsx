import type {
  Image as ImageType,
  CTA as CTAType,
  ComplexImage,
} from "@yext/types";
import { Link, Image } from "@yext/pages-components";
import { useTemplateData } from "src/common/useTemplateData";
import { LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import { MaybeLink } from "../common/MaybeLink";

const Promo = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  if (profile.c_promotionImage2) {
    return (
      <ErrorBoundaryWithAnalytics name="promo">
        <PromoLayout image={profile.c_promotionImage2} />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type PromoLayoutProps = {
  image?: ComplexImage;
};

const PromoLayout = (props: PromoLayoutProps) => {
  return (
    <div className="Promo py-8">
      <div className="bg-employment-image bg-cover bg-no-repeat bg-bottom">
        <div className="legacy-container flex flex-col md:flex-row px-4 py-[56px]">
          {props.image && (
            <MaybeLink className="w-full" href={props.image.clickthroughUrl}>
              <Image image={props.image} />
            </MaybeLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promo;
