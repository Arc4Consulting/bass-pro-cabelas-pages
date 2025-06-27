import { useEffect, useRef, useState } from "react";
import type {
  Coordinate,
  Address as AddressType,
  Image as ImageType,
  WebsiteUrl,
} from "@yext/types";
import { Coordinate as CoordinateClass } from "@yext/components-tsx-geo";
import {
  Link,
  Marker,
  useMapContext,
  Address,
  Image,
} from "@yext/pages-components";
import { useLocator } from "src/components/search/utils/useLocator";
import classNames from "classnames";
import close from "src/assets/images/close.svg";
import { getTeaserUrl } from "src/common/helpers";
import { MaybeLink } from "../common/MaybeLink";

type CustomMarkerProps = {
  coordinate: Coordinate;
  id: string;
  isBasspro: boolean;
  name: string;
  address: AddressType;
  image?: ImageType;
  slug?: string;
  brand?: string;
  relativePrefixToRoot: string;
  c_pagesURL?: string;
  c_pagesURLCabelas?: string;
  geomodifier?: string;
  websiteUrl?: WebsiteUrl;
};

const CustomMarker = (props: CustomMarkerProps) => {
  const { selectedId, hoveredId, setHoveredId, focusedId, setFocusedId } =
    useLocator();

  const {
    coordinate,
    id,
    isBasspro,
    name,
    address,
    image,
    relativePrefixToRoot,
    brand,
    slug,
    websiteUrl,
    c_pagesURL,
    c_pagesURLCabelas,
    geomodifier,
  } = props;
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
  const focused = id === focusedId;
  const [hovered, setIsHovered] = useState(false);
  const map = useMapContext();
  const [cardEntityId, setCardEntityId] = useState("");
  let domain = "https://stores.cabelas.com/";
  if (isBasspro) {
    domain = "https://stores.basspro.com/";
  }

  // If a marker is offscreen when its corresponding LocatorCard is clicked, pan the map to be centered on the marker
  useEffect(() => {
    if (selectedId === id) {
      if (!map.getBounds().contains(new CoordinateClass(coordinate))) {
        map.setCenter(coordinate, true);
      }
    }
  }, [selectedId, id, coordinate, map]);

  useEffect(() => {
    if (hoveredId == id) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [selectedId, hoveredId]);

  return (
    <div className="relative">
      <Marker
        coordinate={coordinate}
        id={id}
        onClick={() => {}}
        onFocus={(focused, id) => setFocusedId(focused ? id : "")}
        onHover={(hovered, id) => {
          if (hovered) {
            setHoveredId(id);
          }
          if (id != cardEntityId) {
            setCardEntityId(id);
          }
        }}
        zIndex={hovered || focused ? 2 : 0}
      >
        <>
          <MapPin
            backgroundColor={isBasspro ? "#1f8500" : "#0058a0"}
            height={21}
            width={18}
          />
          <div
            className={classNames(
              "CustomMarker-card p-3 bg-white absolute z-100 bottom-4 rounded-[8px] font-secondary shadow-box-shadow -translate-x-1/2 min-w-[305px]",
              { hidden: !hovered }
            )}
          >
            <button
              className="absolute right-3 ml-auto h-6 w-6"
              onClick={() => setHoveredId("")}
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
    </div>
  );
};

type MapPinProps = {
  backgroundColor: string;
  height: number;
  textColor?: string;
  width: number;
};

const MapPin = (props: MapPinProps) => {
  const { backgroundColor, height, textColor, width } = props;
  return (
    <svg
      enableBackground="new 0 0 208 253.3"
      height={height}
      viewBox="0 0 208 253.3"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="103.8" cy="100.7" fill="#fff" r="51" />
      <path
        d="m103.8 2.8c-56.4 0-102.2 45.5-102.2 101.5 0 72.3 102.1 146.3 102.1 146.3s102.1-73.4 102.1-146.3c.1-56-45.6-101.5-102-101.5zm0 129c-18.8 0-34-15.1-34-33.8s15.2-33.8 34-33.8 34 15.1 34 33.8-15.3 33.8-34 33.8z"
        fill={backgroundColor}
      />
    </svg>
  );
};

export default CustomMarker;
