import { useEffect, useRef } from "react";
import { Coordinate as CoordinateClass } from "@yext/components-tsx-geo";
import {
  Address,
  Marker,
  useMapContext,
  Image,
  Link,
  getDirections,
  ListingType,
  ImageType,
} from "@yext/pages-components";
import { useLocator } from "src/components/search/utils/useLocator";
import classNames from "classnames";
import type {
  Coordinate,
  Address as AddressType,
  WebsiteUrl,
} from "@yext/types";
import close from "src/assets/images/close.svg";
import { MaybeLink } from "../common/MaybeLink";
import { useBreakpoint } from "src/common/useBreakpoints";
import { getTeaserUrl } from "src/common/helpers";

type CustomMarkerProps = {
  coordinate: Coordinate;
  id: string;
  index: number;
  isBasspro: boolean;
  name: string;
  address: AddressType;
  image?: ImageType;
  slug?: string;
  ref_listings?: ListingType[];
  googlePlaceId?: string;
  brand?: string;
  relativePrefixToRoot: string;
  c_pagesURL?: string;
  c_pagesURLCabelas?: string;
  geomodifier?: string;
  websiteUrl?: WebsiteUrl;
};

const CustomMarker = (props: CustomMarkerProps) => {
  const {
    selectedId,
    setSelectedId,
    hoveredId,
    setHoveredId,
    focusedId,
    setFocusedId,
  } = useLocator();

  const {
    coordinate,
    id,
    isBasspro,
    name,
    image,
    address,
    slug,
    index,
    ref_listings,
    googlePlaceId,
    relativePrefixToRoot,
    c_pagesURLCabelas,
    c_pagesURL,
    brand,
    geomodifier,
    websiteUrl,
  } = props;
  const selected = id === selectedId;
  const focused = id === focusedId;
  const hovered = id === hoveredId;
  const map = useMapContext();
  const isDesktop = useBreakpoint("sm");

  // If a marker is offscreen when its corresponding LocatorCard is clicked, pan the map to be centered on the marker
  useEffect(() => {
    if (selectedId === id) {
      if (!isDesktop) {
        map.setCenter(coordinate, true);
        return;
      }
      const bounds = map.getBounds();
      const mapDiv = document.getElementById("map");
      const mapHeightLat = bounds.ne.latitude - bounds.sw.latitude;
      const mapWidthLng = bounds.ne.longitude - bounds.sw.longitude;

      const mapHeightPx = mapDiv?.clientHeight || 0;
      const mapWidthPx = mapDiv?.clientWidth || 0;

      const heightPixelOffset = 50;
      const widthPixelOffset = 300;

      const latOffset = (heightPixelOffset / mapHeightPx) * mapHeightLat;
      const lngOffset = (widthPixelOffset / mapWidthPx) * mapWidthLng;
      const pinnedCoordinate = new CoordinateClass(
        coordinate.latitude + latOffset,
        coordinate.longitude - lngOffset
      );
      map.setCenter(pinnedCoordinate, true);
    }
  }, [selectedId, id, coordinate, map]);

  const cardUrl = getTeaserUrl(
    relativePrefixToRoot,
    brand,
    slug,
    name,
    c_pagesURL,
    c_pagesURLCabelas,
    address.countryCode,
    websiteUrl?.url
  );

  return (
    <Marker
      coordinate={coordinate}
      id={id}
      onFocus={(focused, id) => setFocusedId(focused ? id : "")}
      onHover={(hovered, id) => setHoveredId(hovered ? id : "")}
      zIndex={selected ? 1 : hovered || focused ? 2 : 0}
    >
      <>
        <MapPin
          onClick={() => setSelectedId(id)}
          backgroundColor={isBasspro ? "#1f8500" : "#0058a0"}
          index={index}
          height={49}
          width={29}
        />
        <div
          className={classNames(
            "CustomMarker-card p-3 min-w-[305px] bg-white absolute z-100 bottom-12 rounded-[8px] font-secondary shadow-box-shadow -translate-x-1/2",
            { hidden: !selected }
          )}
        >
          <button
            className="absolute right-3 ml-auto h-6 w-6"
            onClick={() => setSelectedId("")}
          >
            <img src={close} alt="close info window" />
          </button>
          <MaybeLink href={cardUrl}>
            <div className="flex ml-auto h-6 w-6" />
            <div className="flex gap-2 w-full mt-2">
              {image && (
                <Image className="!max-w-[110px] !h-fit" image={image} />
              )}
              <div className="flex flex-col text-sm w-full">
                <h3 className="text-left font-bold">{name}</h3>
                <div className="text-left">
                  {geomodifier ?? address.city}, {address.region}
                </div>
                {cardUrl && (
                  <a href={cardUrl}>
                    <div className="underline flex mt-1 text-brand-link-blue">
                      View Page
                    </div>
                  </a>
                )}
              </div>
            </div>
          </MaybeLink>
        </div>
      </>
    </Marker>
  );
};

type MapPinProps = {
  backgroundColor?: string;
  height: number;
  index: number;
  textColor?: string;
  width: number;
  onClick?: Function;
};

const MapPin = (props: MapPinProps) => {
  const { backgroundColor, height, index, textColor, width, onClick } = props;
  return (
    <svg
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
      }}
      enableBackground="new 0 0 208 253.3"
      height={height}
      viewBox="0 0 208 253.3"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle
        cx="103.8"
        cy="100.7"
        fill={backgroundColor ? backgroundColor : "#0f70f0"}
        r="51"
      />
      <path
        d="m103.8 2.8c-56.4 0-102.2 45.5-102.2 101.5 0 72.3 102.1 146.3 102.1 146.3s102.1-73.4 102.1-146.3c.1-56-45.6-101.5-102-101.5zm0 129c-18.8 0-34-15.1-34-33.8s15.2-33.8 34-33.8 34 15.1 34 33.8-15.3 33.8-34 33.8z"
        fill={backgroundColor ? backgroundColor : "#0f70f0"}
      />
      <text
        x="50%"
        y="45%"
        fontSize="90px"
        fontWeight="bold"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={textColor ? textColor : "#FFFFFF"}
      >
        {index}
      </text>
    </svg>
  );
};

export default CustomMarker;
