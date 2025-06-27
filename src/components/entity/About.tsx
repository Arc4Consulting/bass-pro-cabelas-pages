import type { Image as ImageType, CTA as CTAType } from "@yext/types";
import { Link, Image } from "@yext/pages-components";
import { useTemplateData } from "src/common/useTemplateData";
import { LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import Markdown from "../common/Markdown";
import classNames from "classnames";
import { getBrand, newlineToBr } from "src/common/helpers";

const About = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  if (profile.c_aboutStoreSubhead && profile.c_pagesBusinessDescription) {
    return (
      <ErrorBoundaryWithAnalytics name="about">
        <AboutLayout
          title={profile.c_aboutStoreSubhead}
          description={profile.c_pagesBusinessDescription}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type AboutLayoutProps = {
  title: string;
  description?: string;
};

const AboutLayout = (props: AboutLayoutProps) => {
  return (
    <div className="About py-8">
      <div className="legacy-container flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="w-full flex flex-col">
          <h2
            className={classNames(
              "Heading Heading--head pb-4 lg:pb-8 text-center text-brand-green-300"
            )}
          >
            {props.title}
          </h2>

          {props.description && (
            <div className="font-secondary lg:columns-2">
              <Markdown>{newlineToBr(props.description)}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
