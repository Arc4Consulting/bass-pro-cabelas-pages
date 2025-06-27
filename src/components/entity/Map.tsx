import {
  Link,
  Address,
  getDirections,
  LocationMap,
  GoogleMaps,
} from "@yext/pages-components";
import type { LocationProfile } from "src/types/entities";
import mapStyles from "src/components/search/defaultMapStyles.json";
import { useBreakpoint } from "src/common/useBreakpoints";
import { LazyLoadWrapper } from "src/components/common/LazyLoadWrapper";
import { getMapKey } from "src/common/getMapKey";
import { useTemplateData } from "src/common/useTemplateData";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";

const Map = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  return (
    <ErrorBoundaryWithAnalytics name="map">
      <MapLayout profile={profile} />
    </ErrorBoundaryWithAnalytics>
  );
};

type MapLayoutProps = {
  profile: LocationProfile;
};

const MapLayout = (props: MapLayoutProps) => {
  const mapKey = getMapKey();
  const isDesktopBreakpoint = useBreakpoint("sm");
  const { profile } = props;
  const mappinSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="57"
      viewBox="0 0 56 57"
      fill="none"
    >
      <path
        d="M28.5833 0.677246C33.25 0.677246 37.3366 2.42182 40.2543 5.33957C43.1721 8.25732 44.9167 12.3439 44.9167 17.0106C44.9167 22.1189 42.1203 26.1089 38.9439 30.7193C34.6107 37.0087 29.5363 44.3999 29.1885 56.9197C27.6304 44.3999 22.5559 37.0087 18.2227 30.7193C15.0464 26.1089 12.25 22.1189 12.25 17.0106C12.25 12.3439 13.9946 8.25732 16.9123 5.33957C19.8301 2.42182 23.9167 0.677246 28.5833 0.677246Z"
        fill="#213629"
        stroke="black"
        stroke-opacity="0.5"
      />
      <path
        d="M28.496 25.1849C32.958 25.1849 36.5752 21.5677 36.5752 17.1056C36.5752 12.6436 32.958 9.02637 28.496 9.02637C24.0339 9.02637 20.4167 12.6436 20.4167 17.1056C20.4167 21.5677 24.0339 25.1849 28.496 25.1849Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div className="Core">
      {isDesktopBreakpoint && profile.yextDisplayCoordinate && (
        <LazyLoadWrapper>
          <LocationMap
            className="h-[300px] mt-6"
            coordinate={profile.yextDisplayCoordinate}
            provider={GoogleMaps}
            providerOptions={{ styles: mapStyles }}
            pinUrl={`${getDirections(
              profile.address,
              profile.ref_listings,
              profile.googlePlaceId
            )}`}
            singleZoom={14}
            defaultZoom={4}
            {...mapKey}
          >
            {mappinSVG}
          </LocationMap>
        </LazyLoadWrapper>
      )}
    </div>
  );
};

export default Map;
