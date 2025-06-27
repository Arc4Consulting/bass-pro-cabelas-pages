import {
  getSearchProvider,
  LOCATOR_ENTITY_TYPE,
  LOCATOR_STATIC_FILTER_FIELD,
} from "src/config";
import { useTemplateData } from "src/common/useTemplateData";
import { SearchHeadlessProvider } from "@yext/search-headless-react";
import { FilterSearch } from "@yext/search-ui-react";
import GeolocateButton from "src/components/search/GeolocateButton";
import { encodeStaticFilters } from "src/components/search/utils/filterEncodings";
import classNames from "classnames";

const searchFields = [
  {
    fieldApiName: LOCATOR_STATIC_FILTER_FIELD,
    entityType: LOCATOR_ENTITY_TYPE,
  },
];

interface DirectorySearchBarProps {
  placeholder: string;
  searcherPath: string;
}

const DirectorySearchBar = (props: DirectorySearchBarProps) => {
  const { document } = useTemplateData();

  // if (!YEXT_PUBLIC_SEARCH_EXPERIENCE_API_KEY) {
  //   console.error(
  //     "Add a search experience API key to the .env file or as a site variable to enable the DirectorySearchBar component."
  //   );
  // }

  const searcher = getSearchProvider(
    "6c7da37b7336cfc204cbde09bcbd0275",
    document.meta.locale,
    document.siteDomain
  );

  return (
    <SearchHeadlessProvider searcher={searcher}>
      <DirectorySearchBarInternal {...props} />
    </SearchHeadlessProvider>
  );
};

const DirectorySearchBarInternal = (props: DirectorySearchBarProps) => {
  const { placeholder, searcherPath } = props;
  let searchButtonClasses =
    "relative before:content-search before:bg-brand-green-500 before:h-full before:w-[54px] before:absolute before:right-0 before:z-[9] before:p-[18px]";

  return (
    <div className="flex items-center justify-center font-secondary my-2">
      <div className="relative w-full justify-center h-[54px]">
        <FilterSearch
          customCssClasses={{
            filterSearchContainer: classNames(
              "absolute w-full mb-0",
              searchButtonClasses
            ),
            inputElement:
              "font-tertiary p-4 text-sm h-auto rounded-none focus:border-2 focus:border-brand-blue-100 active:border-2 active:border-brand-blue-100",
          }}
          label=""
          placeholder={placeholder}
          searchFields={searchFields}
          key="directory-search"
          onSelect={({ newDisplayName, newFilter }) => {
            const searchParams = encodeStaticFilters([
              {
                displayName: newDisplayName,
                filter: newFilter,
                selected: true,
              },
            ]);

            if (searchParams) {
              window.location.href = `${searcherPath}?${searchParams.toString()}`;
            }
          }}
        />
      </div>
    </div>
  );
};

export default DirectorySearchBar;
