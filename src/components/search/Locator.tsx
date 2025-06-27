import { useCallback, useEffect, useState } from "react";
import {
  Matcher,
  useSearchActions,
  useSearchState,
} from "@yext/search-headless-react";
import { Map, GoogleMaps } from "@yext/pages-components";
import { useBreakpoint } from "src/common/useBreakpoints";
import {
  useLoadInitialSearchParams,
  useSyncSearchParamsWithState,
  useSyncStateWithSearchParams,
} from "src/components/search/utils/handleSearchParams";
import { useGetSearchResults } from "src/components/search/utils/useGetSearchResults";
import { LocatorProvider } from "./utils/useLocator";
import { LocationProfile } from "src/types/entities";
import "src/components/search/Locator.css";
import mapStyles from "src/components/search/defaultMapStyles.json";
import SearchBox from "src/components/search/SearchBox";
import LocatorCard from "src/components/cards/LocatorCard";
import ResultInfo from "src/components/search/ResultInfo";
import ResultList from "src/components/search/ResultList";
import CustomMarker from "src/components/search/CustomMarker";
import LoadingSpinner from "src/components/common/LoadingSpinner";
import { getMapKey } from "src/common/getMapKey";
import { getUserLocation } from "@yext/search-ui-react";
import { GEOLOCATE_RADIUS, LOCATOR_STATIC_FILTER_FIELD } from "src/config";
import classNames from "classnames";
import { useTemplateData } from "src/common/useTemplateData";

type LocatorProps = {
  // Will display results up to the verticalLimit (default 20, change with searchActions.setVerticalLimit(num))
  displayAllOnNoResults?: boolean;
  placeholderText?: string;
  subTitle: string;
  title: string;
  allResultsOnLoad?: boolean;
  geolocateOnLoad?: boolean;
};

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

const Locator = (props: LocatorProps) => {
  const {
    displayAllOnNoResults = false,
    allResultsOnLoad = false,
    geolocateOnLoad = false,
    placeholderText,
    subTitle,
    title,
  } = props;
  const mapKey = getMapKey();

  const { relativePrefixToRoot, document } = useTemplateData();
  const brand = document._site?.c_brand;

  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [focusedEntityId, setFocusedEntityId] = useState("");
  const [hoveredEntityId, setHoveredEntityId] = useState("");

  const searchActions = useSearchActions();
  const radiusInMeters = 804670; // 500 miles
  searchActions.setLocationRadius(radiusInMeters);

  const isLoading = useSearchState((state) => state.searchStatus.isLoading);
  const isDesktopBreakpoint = useBreakpoint("lg");
  const [allLocationsLoaded, setAllLocationsLoaded] = useState(false);
  const [initialParamsLoaded, setInitialParamsLoaded] = useState(false);
  const [showList, setShowList] = useState(true);

  const initialParamsLoadedCallback = useCallback(
    () => setInitialParamsLoaded(true),
    [setInitialParamsLoaded]
  );

  // Load static and facet filters on page load.
  useLoadInitialSearchParams(initialParamsLoaded, initialParamsLoadedCallback);
  // Update the search params whenever the search state filters property changes.
  useSyncSearchParamsWithState(initialParamsLoaded);
  // Update the state only on history change.
  useSyncStateWithSearchParams();

  const results = useGetSearchResults<LocationProfile>(
    displayAllOnNoResults,
    allResultsOnLoad,
    geolocateOnLoad,
    () => {
      setAllLocationsLoaded(true);
    }
  );

  // Unset any selected, hovered, or focused markers on new search
  useEffect(() => {
    setSelectedEntityId("");
    setFocusedEntityId("");
    setHoveredEntityId("");
  }, [searchActions.state.query.queryId]);

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
      <div className="Locator relative block lg:flex flex-col bg-brand-gray-1000">
        {(!initialParamsLoaded ||
          isLoading ||
          (allResultsOnLoad && !allLocationsLoaded)) && <LoadingSpinner />}
        <div
          className={classNames(
            "Locator-content lg:absolute lg:z-10 lg:bg-white lg:top-14 lg:w-[41%] lg:left-14 lg:bottom-14 lg:shadow-search-shadow lg:h-min"
          )}
        >
          <SearchBox
            title={title}
            subTitle={subTitle}
            placeholderText={placeholderText}
            setShowList={setShowList}
            showList={showList}
            pin={pin}
          />
          {showList && (
            <div className="bg-brand-gray-1000 p-4 lg:max-h-[400px] xl:max-h-[500px] overflow-auto">
              <ResultInfo pin={pin} />
              <ResultList CardComponent={LocatorCard} pin={pin} />
            </div>
          )}
        </div>
        {(isDesktopBreakpoint || (!isDesktopBreakpoint && !showList)) && (
          <div className="Locator-map lg:fixed left-0 right-0">
            <Map
              provider={GoogleMaps}
              bounds={results.map((data) => data.rawData.yextDisplayCoordinate)}
              padding={{ top: 50, bottom: 50, left: 200, right: 50 }}
              className="h-full"
              {...mapKey}
            >
              {results.map((data, index) => (
                <CustomMarker
                  key={data.rawData.id}
                  coordinate={data.rawData.yextDisplayCoordinate}
                  id={data.rawData.id}
                  isBasspro={data.rawData.name == "Cabela's" ? false : true}
                  name={data.rawData.name}
                  address={data.rawData.address}
                  slug={data.rawData.slug}
                  index={index + 1}
                  ref_listings={data.rawData.ref_listings}
                  image={data.rawData.c_exteriorLocationPhoto}
                  googlePlaceId={data.rawData.googlePlaceId}
                  brand={brand}
                  relativePrefixToRoot={relativePrefixToRoot}
                  c_pagesURL={data.rawData.c_pagesURL}
                  c_pagesURLCabelas={data.rawData.c_pagesURLCabelas}
                  geomodifier={data.rawData.geomodifier}
                  websiteUrl={data.rawData.websiteUrl}
                />
              ))}
            </Map>
          </div>
        )}
      </div>
    </LocatorProvider>
  );
};

export default Locator;
