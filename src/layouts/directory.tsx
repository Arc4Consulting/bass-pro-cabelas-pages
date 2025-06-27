import type {
  DirectoryProfile,
  LocationProfile,
  TemplateRenderProps,
} from "src/types/entities";
import Breadcrumbs from "src/components/common/Breadcrumbs";
import DirectoryCard from "src/components/cards/DirectoryCard";
import DirectoryGrid from "src/components/directory/DirectoryGrid";
import DirectoryHero from "src/components/directory/DirectoryHero";
import DirectoryList from "src/components/directory/DirectoryList";
import LoadingSpinner from "src/components/common/LoadingSpinner";

import { useState, useEffect } from "react";
interface DirectoryListLayoutProps {
  data: TemplateRenderProps<DirectoryProfile<never>>;
}

interface DirectoryGridLayoutProps {
  data: TemplateRenderProps<DirectoryProfile<LocationProfile>>;
}

type DirectoryLayoutProps = DirectoryListLayoutProps | DirectoryGridLayoutProps;

const DirectoryLayout = ({ data }: DirectoryLayoutProps) => {
  const { dm_directoryChildren } = data.document;
  const [isMapLoaded, setMapIsLoaded] = useState(false);
  // clear loader indefinitely in case map fails
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapIsLoaded(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="Directory relative">
      {!isMapLoaded && <LoadingSpinner />}
      <DirectoryHero
        children={dm_directoryChildren}
        setMapIsLoaded={setMapIsLoaded}
      />
      <DirectoryGrid CardComponent={DirectoryCard} />
    </div>
  );
};

export default DirectoryLayout;
