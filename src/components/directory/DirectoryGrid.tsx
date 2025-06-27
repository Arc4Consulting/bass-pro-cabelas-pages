import DirectoryCard from "src/components/cards/DirectoryCard";
import type { CardComponent } from "src/models/cardComponent";
import type { DirectoryProfile, LocationProfile } from "src/types/entities";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import { useTemplateData } from "src/common/useTemplateData";
import { groupDirectoryByCountryByRegion } from "src/common/helpers";

interface DirectoryGridProps {
  CardComponent: CardComponent<LocationProfile>;
}

// This template unpacks/transforms data from the API response and then calls the Layout template
const DirectoryGrid = (props: DirectoryGridProps) => {
  const templateData = useTemplateData();
  const profile = templateData.document as DirectoryProfile<LocationProfile>;

  if (profile.dm_directoryChildren) {
    return (
      <ErrorBoundaryWithAnalytics name="directory">
        <DirectoryGridLayout
          CardComponent={props.CardComponent}
          directoryChildren={profile.dm_directoryChildren}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type DirectoryGridLayoutProps = DirectoryGridProps & {
  directoryChildren: LocationProfile[];
};

// This template renders the data into HTML
const DirectoryGridLayout = (props: DirectoryGridLayoutProps) => {
  const { directoryChildren, CardComponent = DirectoryCard } = props;
  const groupedDirectoryChildren =
    groupDirectoryByCountryByRegion(directoryChildren);

  return (
    <div className="legacy-container my-8">
      <div className="flex flex-wrap -m-4">
        {Object.keys(groupedDirectoryChildren)
          .sort((a, b) => (a < b ? 1 : -1))
          .map((country, i) => {
            const countryData = groupedDirectoryChildren[country];
            return (
              <div key={"country" + i} className="flex flex-wrap">
                <div className="Heading Heading--large w-full uppercase sm:pb-4 m-4 font-secondary font-bold">
                  {country}
                </div>
                {Object.keys(countryData)
                  .sort((a, b) => (a > b ? 1 : -1))
                  .map((region, j) => {
                    const regionData = countryData[region];
                    return (
                      <div key={"region" + j} className="flex w-full flex-wrap">
                        <div className="Heading Heading--sub w-full uppercase pb-[10px] mx-4 my-6 font-secondary font-bold sm:border-b border-brand-gray-800">
                          {region}
                        </div>
                        {regionData
                          .sort((a: any, b: any) =>
                            a.address.city < b.address.city ? -1 : 1
                          )
                          .map((location: any, k: number) => {
                            return (
                              <li
                                className="p-4 w-full md:w-1/2 list-none"
                                key={`${i}-${j}-${k}`}
                              >
                                <CardComponent profile={location} />
                              </li>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DirectoryGrid;
