import type { CardProps } from "@yext/search-ui-react";
import {
  Link,
  Address,
  getDirections,
  Image,
  ListingType,
} from "@yext/pages-components";
import type { Address as AddressType } from "@yext/types";
import classNames from "classnames";
import { LocationProfile } from "src/types/entities";
import { useTemplateData } from "src/common/useTemplateData";
import { MaybeLink } from "src/components/common/MaybeLink";
import {
  formatPhone,
  futureTemplateText,
  getTeaserUrl,
} from "src/common/helpers";
import mapPin from "src/assets/images/mapPin.svg";
import { HoursStatus, StatusParams } from "@yext/sites-react-components";

export interface LocatorCardProps {
  useKilometers?: boolean;
}

const LocatorCard = (props: LocatorCardProps & CardProps<LocationProfile>) => {
  const { result } = props;
  const { rawData } = result;
  const {
    address,
    hours,
    slug,
    name,
    mainPhone,
    ref_listings,
    googlePlaceId,
    c_pagesURL,
    c_pagesURLCabelas,
    timezone,
  } = rawData;
  const { relativePrefixToRoot, document } = useTemplateData();

  const brand = document._site?.c_brand;
  const cardUrl = getTeaserUrl(
    relativePrefixToRoot,
    brand,
    slug,
    name,
    c_pagesURL,
    c_pagesURLCabelas,
    address.countryCode
  );

  return (
    <div className="LocatorCard font-tertiary text-brand-gray-900 w-full">
      <div className="flex justify-between">
        <MaybeLink
          className="underline text-brand-primary text-base uppercase decoration-brand-link-blue text-sm"
          href={cardUrl}
        >
          <h3 className="pb-2 sm:pb-3">
            {name} {address.city}, {address.region}
          </h3>
        </MaybeLink>
        <TeaserDistance
          {...props}
          className=""
          ref_listings={ref_listings}
          googlePlaceId={googlePlaceId}
          address={address}
        />
      </div>
      {hours && (
        <div className="pb-2 sm:pb-4 text-xs font-bold font-tertiary">
          <HoursStatus
            dayOfWeekTemplate={() => null}
            hours={hours}
            timezone={timezone}
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
      <div>
        <Address
          className="text-sm"
          address={address}
          lines={[["line1"], ["line2"], ["city", ",", "region", "postalCode"]]}
        />
      </div>
      <div className="flex justify-between">
        {mainPhone && (
          <span className="text-brand-green-500 flex gap-2 items-center">
            <svg
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="lg:hidden rotate-90"
            >
              <path
                d="M15.4188 0.769072L12.1688 0.0190875C11.8157 -0.0621608 11.4532 0.12221 11.3095 0.453454L9.8095 3.95338C9.67825 4.25963 9.76575 4.61899 10.0251 4.82836L11.9188 6.37833C10.7939 8.77516 8.82827 10.7689 6.38145 11.9157L4.83148 10.022C4.61898 9.76264 4.26274 9.67514 3.95649 9.80639L0.456566 11.3064C0.122198 11.4532 -0.0621732 11.8157 0.0190751 12.1688L0.76906 15.4188C0.847183 15.7563 1.14718 16 1.50029 16C9.50326 16 16 9.51577 16 1.50031C16 1.15031 15.7594 0.847196 15.4188 0.769072Z"
                fill="currentColor"
              />
            </svg>
            <Link
              className="text-sm text-brand-link-blue lg:text-black underline lg:no-underline"
              href={mainPhone}
            >
              {formatPhone(mainPhone, address.countryCode)}
            </Link>
          </span>
        )}
        <span className="text-brand-green-500 flex gap-2 items-center lg:hidden">
          <img src={mapPin} className="w-[11px] h-[11px]" />
          <Link
            className="Link underline text-sm text-black"
            href={`${getDirections(address, ref_listings, googlePlaceId)}`}
          >
            Directions
          </Link>
        </span>
      </div>
    </div>
  );
};

const TeaserDistance = (
  props: LocatorCardProps &
    CardProps<LocationProfile> & {
      className?: string;
      ref_listings?: ListingType[];
      googlePlaceId?: string;
      address: AddressType;
    }
) => {
  const {
    className,
    result,
    useKilometers = false,
    address,
    googlePlaceId,
    ref_listings,
  } = props;
  const { distanceFromFilter } = result;

  if (!distanceFromFilter) {
    return null;
  }

  return (
    <div
      className={classNames(
        "whitespace-nowrap pt-2 sm:pt-0 text-xs flex flex-col text-right",
        className
      )}
    >
      {`${getDistance(distanceFromFilter, useKilometers)} ${
        useKilometers ? "km" : "mi"
      }`}
      <Link
        className="Link underline text-sm hidden lg:flex"
        href={`${getDirections(address, ref_listings, googlePlaceId)}`}
      >
        Get Directions
      </Link>
    </div>
  );
};

// Convert meters to miles or kilometers.
function getDistance(distance: number, useKilometers: boolean) {
  if (useKilometers) {
    return (distance / 1000).toFixed(2);
  }
  return (distance / 1609.344).toFixed(2);
}

export default LocatorCard;
