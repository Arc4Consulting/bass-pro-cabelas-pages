import type { Image as ImageType, CTA as CTAType } from "@yext/types";
import { Link, Image } from "@yext/pages-components";
import { useTemplateData } from "src/common/useTemplateData";
import { LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";

const Employment = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  if (
    profile?.c_employmentPromoTitle &&
    (profile.c_employmentPromoDescription || profile.description)
  ) {
    return (
      <ErrorBoundaryWithAnalytics name="employment">
        <EmploymentLayout
          title={profile.c_employmentPromoTitle}
          description={
            profile.c_employmentPromoDescription || profile.description
          }
          ctaText={profile.c_employmentPromoButtonText}
          ctaUrl={profile.c_employmentPromoButtonURl}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type EmploymentLayoutProps = {
  title: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
};

const EmploymentLayout = (props: EmploymentLayoutProps) => {
  return (
    <div className="py-8">
      <div className="bg-employment-image bg-cover bg-no-repeat bg-bottom bg-black">
        <div className="Employment py-[56px] sm:py-16">
          <div className="legacy-container">
            <div className="w-full md:w-1/2 flex flex-col gap-8 items-center sm:items-start">
              <h2 className="Heading Heading--head text-white">
                {props.title}
              </h2>

              {props.description && (
                <div className="text-white font-secondary text-center sm:text-left">
                  {props.description}
                </div>
              )}

              {props.ctaText && props.ctaUrl && (
                <Link
                  className="inline-flex sm:self-start Button Button--employment"
                  href={props.ctaUrl}
                >
                  {props.ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employment;
