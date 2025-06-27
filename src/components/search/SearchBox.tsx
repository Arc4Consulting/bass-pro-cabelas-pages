import { FilterSearch, SearchBar, executeSearch } from "@yext/search-ui-react";
import { useSearchActions, useSearchState } from "@yext/search-headless-react";
import {
  LOCATOR_STATIC_FILTER_FIELD,
  LOCATOR_ENTITY_TYPE,
  FALLBACK_DIRECTORY_PATH,
} from "src/config";
import GeolocateButton from "src/components/search/GeolocateButton";
import { useTemplateData } from "src/common/useTemplateData";
import { Link } from "@yext/pages-components";
import { getBrand } from "src/common/helpers";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import { useBreakpoint } from "src/common/useBreakpoints";

const searchFields = [
  {
    fieldApiName: LOCATOR_STATIC_FILTER_FIELD,
    entityType: LOCATOR_ENTITY_TYPE,
  },
];

type SearchBoxProps = {
  title: string;
  subTitle: string;
  placeholderText?: string;
  setShowList: Dispatch<SetStateAction<boolean>>;
  showList: boolean;
  pin: any;
};

const SearchBox = (props: SearchBoxProps) => {
  const { title, subTitle, placeholderText, showList, setShowList, pin } =
    props;
  const { relativePrefixToRoot } = useTemplateData();
  const searchActions = useSearchActions();
  const results = useSearchState((s) => s.vertical?.results);

  const isDesktopBreakpoint = useBreakpoint("lg");
  return (
    <div className="font-secondary p-4 bg-white">
      <div className="">
        <div className="mb-4">
          <Link
            className={classNames(
              "Link Link--underline text-base font-bold font-tertiary",
              { "text-brand-green-300": getBrand() == "Basspro" },
              { "text-brand-primary": getBrand() != "Basspro" }
            )}
            href={relativePrefixToRoot + FALLBACK_DIRECTORY_PATH}
          >
            All Bass Pro and Cabela's Locations
          </Link>
        </div>
        <h1 className="text-[28px] md:text-[38px] md:leading-[38px] font-bold text-brand-gray-900 text-center lg:text-left">
          {title}
        </h1>
        <div className="text-[28px] lg:text-[38px] lg:leading-[38px]  mb-2 text-brand-gray-900 font-bold text-center lg:text-left">
          {subTitle}
        </div>
        <div className="font-tertiary text-base mt-6 flex mb-[10px]">
          Bass Pro Shops and Cabela’s are one team now.
          <Link
            className="Link Link--underline font-bold ml-1 text-brand-green-300"
            href="https://www.basspro.com/shop/en/together?cm_sp=CblAqSep2017_YX"
          >
            Learn More.
          </Link>
        </div>
        <div className="flex items-center my-1">
          <div className="relative w-full justify-center h-[54px]">
            <FilterSearch
              customCssClasses={{
                filterSearchContainer:
                  "h-full absolute w-full relative before:content-search before:bg-brand-green-500 before:h-full before:w-[54px] before:absolute before:right-0 before:z-[9] before:p-[18px]",
                inputElement:
                  "font-tertiary p-4 text-sm h-auto rounded-none focus:border-2 focus:border-brand-blue-100 active:border-2 active:border-brand-blue-100",
              }}
              label=""
              placeholder={placeholderText}
              searchFields={searchFields}
              onSelect={({
                currentFilter,
                executeFilterSearch,
                newDisplayName,
                newFilter,
                setCurrentFilter,
              }) => {
                // Update static filters.
                if (currentFilter) {
                  searchActions.setFilterOption({
                    filter: currentFilter,
                    selected: false,
                  });
                }
                searchActions.setFilterOption({
                  filter: newFilter,
                  displayName: newDisplayName,
                  selected: true,
                });
                setCurrentFilter(newFilter);
                executeFilterSearch(newDisplayName);

                // Execute search on select.
                searchActions.setOffset(0);
                searchActions.resetFacets();
                executeSearch(searchActions);
              }}
            />
          </div>
        </div>
      </div>
      {!isDesktopBreakpoint && results?.length && (
        <div className="flex flex-row text-brand-primary text-lg border-t mt-[15px]">
          <button
            className={classNames(
              "border-b-[4px] w-1/2 px-[6px] py-[10px]",
              { "border-brand-primary": !showList },
              { "border-transparent": showList }
            )}
            onClick={() => setShowList(!showList)}
          >
            Map
          </button>
          <button
            className={classNames(
              "border-b-[4px] w-1/2 px-[6px] py-[10px]",
              { "border-brand-primary": showList },
              { "border-transparent": !showList }
            )}
            onClick={() => setShowList(!showList)}
          >
            List
          </button>
        </div>
      )}
      <div
        className={classNames(
          "flex font-tertiary text-xs gap-4 mt-4 lg:mt-5 hidden lg:flex"
        )}
      >
        <div className="flex gap-1">
          <div className="h-[18px] w-[20px] pr-[5px] text-[#1f8500] my-auto">
            {pin}
          </div>
          <div className="my-auto">Bass Pro Shops</div>
        </div>
        <div className="flex gap-1">
          <div className="h-[18px] w-[20px] pr-[5px] text-[#0058a0] my-auto">
            {pin}
          </div>
          <div className="my-auto">Cabela's</div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
