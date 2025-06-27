import type { Image as ImageType, CTA as CTAType } from "@yext/types";
import { useTemplateData } from "src/common/useTemplateData";
import { BiosProfile, LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import classNames from "classnames";
import { getBrand, newlineToBr } from "src/common/helpers";
import { Image } from "@yext/pages-components";
import RTF from "src/components/common/RTF";
import Markdown from "src/components/common/Markdown";
import "src/components/entity/Bios.css";

const Bios = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  if (profile.c_staffSectionTitle && profile.c_linkedEntity) {
    return (
      <ErrorBoundaryWithAnalytics name="bios">
        <BiosLayout
          title={profile.c_staffSectionTitle}
          bios={profile.c_linkedEntity}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type BiosLayoutProps = {
  title?: string;
  bios?: BiosProfile[];
};

const BiosLayout = (props: BiosLayoutProps) => {
  return (
    <div className="Bios pt-8 xs:pb-8 font-secondary">
      <div className="legacy-container">
        <h2
          className={classNames(
            "Heading Heading--head pb-4 lg:pb-8 text-center text-brand-green-300"
          )}
        >
          {props.title}
        </h2>
        {props.bios && (
          <div className="c-bios-list row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[-16px] gap-y-[32px] sm:gap-y-0">
            {props.bios.map((bio) => (
              <div className="c-bios-bio-wrapper pb-[32px] px-[16px]">
                <div className="c-bios-bio">
                  <div className="c-bio-main-info flex pb-[16px]">
                    {bio.c_bioPhoto && (
                      <div className="c-bios-bio-image-wrapper h-[80px] w-[80px]">
                        <div className="c-bios-bio-image h-full w-full">
                          <Image
                            image={bio.c_bioPhoto}
                            className="h-full w-full"
                          />
                        </div>
                      </div>
                    )}
                    {bio.name && (
                      <div className="c-bios-name-title flex pl-[24px]">
                        <div className="c-bios-bio-name text-[18px] sm:text-[24px] uppercase text-brand-green-300 self-center font-primary">
                          {bio.name}
                        </div>
                      </div>
                    )}
                  </div>
                  {bio.description && (
                    <div className="c-bios-bio-description text-[16px] text-brand-gray-600">
                      <div className="c-description">
                        <Markdown>{newlineToBr(bio.description)}</Markdown>
                      </div>
                    </div>
                  )}
                  {bio.c_affiliationsAndCertifications && (
                    <ul className="affiliationsAndCertifications block list-disc mt-4 mb-4 ms-0 me-0 pl-10">
                      {bio.c_affiliationsAndCertifications.map(
                        (item, index) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  )}
                  {bio.services && (
                    <ul className="services block list-disc mt-4 mb-4 ms-0 me-0 pl-10">
                      {bio.services.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bios;
