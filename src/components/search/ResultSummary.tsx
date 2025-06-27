import { useMemo } from "react";
import { useSearchState } from "@yext/search-headless-react";
import type { State } from "@yext/search-headless-react";
import { LOCATOR_STATIC_FILTER_FIELD } from "src/config";
import { useTemplateData } from "src/common/useTemplateData";
import { checkIsLocationFilter } from "src/components/search/utils/checkIsLocationFilter";
import { useLocator } from "./utils/useLocator";
import classNames from "classnames";

const ResultSummary = () => {
  const searchState = useSearchState((state) => state);
  const { relativePrefixToRoot } = useTemplateData();
  const { results } = useLocator();
  const resultsText = useMemo(
    () => getResultsCountText(searchState, results.length),
    [searchState, results.length]
  );

  // Element to render for results summary when page is first loaded before a search is made.
  const initialSummaryText = (
    <span>
      Please search by city and state or zip code, or browse the{" "}
      <a href={relativePrefixToRoot + "index.html"} className="Link--underline">
        Store Directory
      </a>
      .
    </span>
  );

  return (
    <div
      className={classNames(
        "font-tertiary text-sm text-brand-gray-900 w-full",
        { "p-5 pt-10 sm:pt-5": results.length == 0 }
      )}
    >
      {searchState.query.queryId ? resultsText : initialSummaryText}
    </div>
  );
};

function getResultsCountText(state: State, resultsCount: number) {
  let searchPlace = "";

  if (state.filters.static?.length) {
    // Make sure to get the match to the correct filter in case multiple are set.
    const activeFilter =
      state.filters.static.find(
        (f) =>
          f.selected &&
          f.filter.kind === "fieldValue" &&
          // If the locator is searching on "builtin.location", check if the selected filter is also a location filter.
          // Otherwise just match the locator filter fieldId to the selected filter fieldId.
          (LOCATOR_STATIC_FILTER_FIELD === "builtin.location"
            ? checkIsLocationFilter(f.filter)
            : LOCATOR_STATIC_FILTER_FIELD === f.filter.fieldId) &&
          f.displayName
      ) ?? null;
    if (activeFilter?.displayName) {
      searchPlace = activeFilter.displayName;
    }
  }

  if (searchPlace) {
    if (resultsCount === 0) {
      return `No locations within 100 miles of "${searchPlace}."`;
    }
    if (resultsCount === 1) {
      return `${resultsCount} store near "${searchPlace}"`;
    }
    return `${resultsCount} stores near "${searchPlace}"`;
  }

  if (resultsCount === 0) {
    return `No stores found.`;
  }
  if (resultsCount === 1) {
    return `${resultsCount} store found.`;
  }
  return `${resultsCount} stores found.`;
}

export default ResultSummary;
