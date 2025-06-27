import { HoursStatus, StatusParams } from "@yext/sites-react-components";
import { Address } from "@yext/pages-components";
import type { LiveAPIProfile, LocationProfile } from "src/types/entities";
import { CardComponent } from "src/models/cardComponent";
import { useTemplateData } from "src/common/useTemplateData";
import { MaybeLink } from "src/components/common/MaybeLink";
import { futureTemplateText, getBrand } from "src/common/helpers";
import classNames from "classnames";

const NearbyCard: CardComponent<
  LocationProfile | LiveAPIProfile<LocationProfile>
> = function NearbyCard(props): JSX.Element {
  const { profile } = props;
  const { relativePrefixToRoot } = useTemplateData();

  return (
    <div className="NearbyCard bg-white border h-full">
      <MaybeLink
        className="flex flex-col p-6 hover:bg-brand-nearby gap-2"
        href={profile.slug ? relativePrefixToRoot + profile.slug : ""}
      >
        <div className="text-brand-green-300">
          <h3 className="text-lg font-medium tracking-[1.5px]">
            {profile.name}
          </h3>
          <div className="text-lg font-medium tracking-[1.5px]">
            {profile.address.city}, {profile.address.region}
          </div>
        </div>
        {profile.hours && (
          <div className="text-sm font-secondary">
            <HoursStatus
              hours={profile.hours}
              timezone={profile.timezone}
              futureTemplate={(params: StatusParams) => {
                return futureTemplateText(
                  params.isOpen,
                  params.futureInterval?.start,
                  " "
                );
              }}
            />
          </div>
        )}

        {profile.address && (
          <div className="text-sm font-secondary">
            <Address address={profile.address} lines={[["line1"]]} />
          </div>
        )}
      </MaybeLink>
    </div>
  );
};

export default NearbyCard;
