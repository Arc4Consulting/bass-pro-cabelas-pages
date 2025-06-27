import {
  Address,
  Link,
  getDirections,
  HoursStatus,
} from "@yext/pages-components";
import type { LiveAPIProfile, LocationProfile } from "src/types/entities";
import { CardComponent } from "src/models/cardComponent";
import { useTemplateData } from "src/common/useTemplateData";
import { MaybeLink } from "src/components/common/MaybeLink";
import classNames from "classnames";
import {
  formatPhone,
  futureTemplateText,
  getBrand,
  statusTemplateTextOpen,
  statusTemplateTextClosed,
  isTodayDate,
  getTeaserUrl,
} from "src/common/helpers";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useBreakpoint } from "src/common/useBreakpoints";
import { StatusParams } from "@yext/sites-react-components";

const DirectoryCard: CardComponent<
  LocationProfile | LiveAPIProfile<LocationProfile>
> = function DirectoryCard(props): JSX.Element {
  const { profile } = props;
  const { relativePrefixToRoot, document } = useTemplateData();

  const pin = (
    <svg
      enableBackground="new 0 0 208 253.3"
      viewBox="0 0 208 253.3"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <circle cx="103.8" cy="100.7" fill="#fff" r="51" />
      <path d="m103.8 2.8c-56.4 0-102.2 45.5-102.2 101.5 0 72.3 102.1 146.3 102.1 146.3s102.1-73.4 102.1-146.3c.1-56-45.6-101.5-102-101.5zm0 129c-18.8 0-34-15.1-34-33.8s15.2-33.8 34-33.8 34 15.1 34 33.8-15.3 33.8-34 33.8z" />
    </svg>
  );

  const isDesktopBreakpoint = useBreakpoint("md");

  const brand = document._site?.c_brand;
  const cardUrl = getTeaserUrl(
    relativePrefixToRoot,
    brand,
    profile.slug,
    profile.name,
    profile.c_pagesURL,
    profile.c_pagesURLCabelas,
    profile.address.countryCode
  );

  return (
    <div className="Directorycard gap-4 bg-white p-4 border h-full border-brand-gray-800 font-secondary flex flex-row justify-between text-brand-gray-900 font-tertiary">
      <div className="flex flex-row gap-4">
        <div
          className={classNames(
            "h-[18px] w-[15px] shrink-0",
            { "text-[#0058a0]": profile.c_storeBrand == "Cabelas" },
            { "text-[#1f8500]": profile.c_storeBrand != "Cabelas" }
          )}
        >
          {pin}
        </div>
        <div>
          <h3 className="mb-[10px] text-sm font-medium uppercase text-brand-green-500">
            <MaybeLink
              className="underline decoration-brand-link-blue"
              href={cardUrl}
            >
              {profile.name} {profile.address.city}, {profile.address.region}
            </MaybeLink>
          </h3>

          {profile.hours && (
            <div className="mb-[10px] text-xs font-bold text-brand-gray-900">
              <HoursStatus
                hours={profile.hours}
                timezone={profile.timezone}
                dayOfWeekTemplate={() => null}
                statusTemplate={(params: StatusParams) => {
                  if (params.currentInterval?.is24h()) {
                    return "Open 24 Hours";
                  }
                  if (params.isOpen) {
                    return statusTemplateTextOpen(
                      params.currentInterval?.getEndTime()
                    );
                  } else {
                    let futureStartTime = params.futureInterval?.getStartTime();
                    const futureEndTime = params.futureInterval?.getEndTime();
                    if (futureStartTime) {
                      const options: Intl.DateTimeFormatOptions = {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      };
                      const futureDateTime: string =
                        params.futureInterval?.getStartTime("en-US", options) ||
                        "";
                      const futureDate = new Date(futureDateTime);
                      if (!isTodayDate(futureDate)) {
                        futureStartTime = "";
                      }
                    }
                    return statusTemplateTextClosed(
                      futureStartTime,
                      futureEndTime
                    );
                  }
                }}
              />
            </div>
          )}

          {profile.address && (
            <div className="text-sm">
              <Address
                address={profile.address}
                lines={[
                  ["line1", "line2"],
                  ["city", ",", "region", "postalCode"],
                ]}
              />
            </div>
          )}
          {profile.mainPhone && (
            <div className="flex items-end md:items-start mt-3 md:mt-0 gap-2">
              <FaPhoneAlt className="md:hidden my-auto text-brand-green-500 w-3" />
              <Link
                className="text-brand-link-blue text-sm underline md:no-underline md:text-black"
                href={`tel:${profile.mainPhone}`}
              >
                {formatPhone(profile.mainPhone, profile.address.countryCode)}
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-end md:items-start shrink-0">
        <Link
          className="underline text-sm flex gap-[10px]"
          href={`${getDirections(
            profile.address,
            profile.ref_listings,
            profile.googlePlaceId
          )}`}
          eventName="getdirections"
        >
          <FaMapMarkerAlt className="md:hidden my-auto text-brand-green-500 w-2" />
          {isDesktopBreakpoint ? "Get Directions" : "Directions"}
        </Link>
      </div>
    </div>
  );
};

export default DirectoryCard;
