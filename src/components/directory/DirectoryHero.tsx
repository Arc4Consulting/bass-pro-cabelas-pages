import { useTemplateData } from "src/common/useTemplateData";
import DirectorySearchBar from "src/components/directory/DirectorySearchBar";
import { FALLBACK_SEARCH_PATH } from "src/config";
import { DirectoryProfile, LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import { Link } from "@yext/pages-components";
import { useBreakpoint } from "src/common/useBreakpoints";
import { Map, GoogleMaps } from "@yext/pages-components";
import mapStyles from "src/components/search/defaultMapStyles.json";
import { getMapKey } from "src/common/getMapKey";
import { LocatorProvider } from "../search/utils/useLocator";
import { useEffect, useState, useRef } from "react";
import { Result, Source } from "@yext/search-headless-react";
import { useIfVisible } from "src/common/useIfVisible";
import CustomMarker from "src/components/directory/CustomMarker";
import classNames from "classnames";

const mapKey = getMapKey();

// This template unpacks/transforms data from the API response and then calls the Layout template
const DirectoryHero = (props: {
  children?: LocationProfile[];
  setMapIsLoaded?: (m: boolean) => void;
}) => {
  const templateData = useTemplateData();

  if (!props.children) return null;
  const profile = templateData.document as DirectoryProfile<never>;
  const searchPath =
    templateData.relativePrefixToRoot +
    (profile._site.c_searchPage?.slug || FALLBACK_SEARCH_PATH);
  const brand = profile._site?.c_brand;

  return (
    <ErrorBoundaryWithAnalytics name="directory_hero">
      <DirectoryHeroLayout
        searchPath={searchPath}
        children={props.children}
        setMapIsLoaded={props.setMapIsLoaded}
        brand={brand}
      />
    </ErrorBoundaryWithAnalytics>
  );
};

interface DirectoryHeroProps {
  searchPath?: string;
  children?: LocationProfile[];
  setMapIsLoaded?: (m: boolean) => void;
  brand?: string;
}

// This template renders the data into HTML
const DirectoryHeroLayout = (props: DirectoryHeroProps) => {
  const { children, setMapIsLoaded, brand } = props;
  const { relativePrefixToRoot } = useTemplateData();

  const isDesktopBreakpoint = useBreakpoint("md");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [focusedEntityId, setFocusedEntityId] = useState("");
  const [hoveredEntityId, setHoveredEntityId] = useState("");

  const results: Result<LocationProfile>[] = (children || [])?.map(
    (profile, idx) => {
      const currResult: Result<LocationProfile> = {
        rawData: profile,
        source: Source.KnowledgeManager,
        index: idx,
        name: profile.name,
        id: profile.id,
      };
      return currResult;
    }
  );

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

  const mapRef = useRef<HTMLDivElement>(null);
  const isMapVisible = useIfVisible(mapRef);

  useEffect(() => {
    if (setMapIsLoaded && (isMapVisible || !isDesktopBreakpoint)) {
      setMapIsLoaded(true);
    }
  }, [isMapVisible, isDesktopBreakpoint]);

  return (
    <LocatorProvider
      value={{
        results,
        selectedId: selectedEntityId,
        setSelectedId: setSelectedEntityId,
        focusedId: focusedEntityId,
        setFocusedId: setFocusedEntityId,
        hoveredId: hoveredEntityId,
        setHoveredId: setHoveredEntityId,
      }}
    >
      <div className="DirectoryHero py-4 sm:py-8 px-4 md:px-0 md:absolute md:z-10 md:bg-white md:top-12 md:left-12 md:px-[30px] md:py-[20px] border-b sm:border-none">
        {children?.length && (
          <h1 className="mb-4 text-center md:text-left text-brand-gray-900">
            <div className="text-lg md:text-xl mb-2 font-tertiary">
              {children.length} Retail Stores
            </div>
            <div className="text-[28px] md:text-[38px] font-bold font-tertiary">
              In the US and Canada
            </div>
          </h1>
        )}
        <div className="font-tertiary text-base flex sm:inline-flex">
          Bass Pro Shops and Cabela’s are one team now.
          <Link
            className="Link Link--underline font-bold ml-1 text-brand-green-300"
            href="https://www.basspro.com/shop/en/together?cm_sp=CblAqSep2017_YX"
          >
            Learn More.
          </Link>
        </div>
        {props.searchPath && (
          <DirectorySearchBar
            placeholder="e.g. Springfield, MO or 65898"
            searcherPath={props.searchPath}
          />
        )}
        <div className="flex font-tertiary text-xs gap-4 mt-5">
          <div className="flex gap-1">
            <div className="h-[18px] w-[15px] text-[#1f8500] my-auto">
              {pin}
            </div>
            <div className="my-auto">Bass Pro Shops</div>
          </div>
          <div className="flex gap-1">
            <div className="h-[18px] w-[15px] text-[#0058a0] my-auto">
              {pin}
            </div>
            <div className="my-auto">Cabela's</div>
          </div>
        </div>
      </div>
      <div
        className={classNames("Locator-map h-[600px]", {
          hidden: !isDesktopBreakpoint,
        })}
        ref={mapRef}
      >
        <Map
          provider={GoogleMaps}
          providerOptions={{ styles: mapStyles }}
          defaultCenter={{ latitude: 40.143754, longitude: -124.998625 }}
          padding={{ top: 0, bottom: 0, left: 100, right: 0 }}
          className="h-full"
          {...mapKey}
        >
          {results.map((data) => (
            <CustomMarker
              key={data.rawData.id}
              coordinate={data.rawData.yextDisplayCoordinate}
              id={data.rawData.id}
              isBasspro={data.rawData.name == "Cabela's" ? false : true}
              name={data.rawData.name}
              address={data.rawData.address}
              image={data.rawData.c_exteriorLocationPhoto}
              slug={data.rawData.slug}
              relativePrefixToRoot={relativePrefixToRoot}
              c_pagesURL={data.rawData.c_pagesURL}
              c_pagesURLCabelas={data.rawData.c_pagesURLCabelas}
              geomodifier={data.rawData.geomodifier}
              websiteUrl={data.rawData.websiteUrl}
              brand={brand}
            />
          ))}
        </Map>
      </div>
    </LocatorProvider>
  );
};

export default DirectoryHero;
