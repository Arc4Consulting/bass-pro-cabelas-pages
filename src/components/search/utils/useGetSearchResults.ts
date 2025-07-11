import { useState, useEffect } from "react";
import {
  Result,
  Matcher,
  SearchCore,
  useSearchState,
  useSearchActions,
} from "@yext/search-headless-react";
import { getUserLocation } from "@yext/search-ui-react";
import { GEOLOCATE_RADIUS, LOCATOR_STATIC_FILTER_FIELD } from "src/config";
import { useLocation, useSearchParams } from "react-router-dom";

async function fetchAll<T>(
  core: SearchCore,
  verticalKey: string,
  limit = Infinity
) {
  async function fetchPage(offset: number) {
    const res = await core.verticalSearch({
      query: "",
      verticalKey: verticalKey,
      limit: Math.min(limit, 50),
      offset,
      retrieveFacets: false,
      skipSpellCheck: true,
    });
    return res;
  }

  const res = await fetchPage(0);

  const searches = [Promise.resolve(res)];
  const per = 50; // Max number of entities allowed per response
  const totalEntities = Math.min(res.verticalResults.resultsCount, limit);

  for (
    let offset = res.verticalResults.results.length;
    offset < totalEntities;
    offset += per
  ) {
    searches.push(fetchPage(offset));
  }
  const out: Result<T>[] = [];
  await Promise.all(searches).then((responses) => {
    for (const response of responses) {
      out.push(...(response.verticalResults.results as Result<T>[]));
    }
  });
  return out;
}

// Get the results from the search state and cast to the given type.
export function useGetSearchResults<T>(
  displayAllOnNoResults?: boolean,
  allResultsOnLoad?: boolean,
  geolocateOnLoad?: boolean,
  allResultsLoadedCallback?: () => void
) {
  const [allResults, setAllResults] = useState<Result<T>[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const actions = useSearchActions();
  const state = useSearchState((s) => s);
  const initialLoad = !state.query.queryId;

  async function autoGeolocate() {
    const position = await getUserLocation();

    actions.setStaticFilters([
      {
        displayName: "My Location",
        selected: true,
        filter: {
          kind: "fieldValue",
          fieldId: LOCATOR_STATIC_FILTER_FIELD,
          matcher: Matcher.Near,
          value: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 1609 * GEOLOCATE_RADIUS,
          },
        },
      },
    ]);
    await actions.executeVerticalQuery();
  }

  useEffect(() => {
    if (!allResultsOnLoad || !state.vertical.verticalKey) return;
    async function load() {
      // @ts-expect-error core is private, but we want to reuse the same core as the
      // locator, rather than needing to create a new instance with the same configuration
      // it's less convenient to use it indirectly through searchActions.executeVerticalQuery
      // because that doesn't provide us direct access to results
      const res = await fetchAll<T>(actions.core, state.vertical.verticalKey);
      setAllResults(res);
      if (allResultsLoadedCallback) allResultsLoadedCallback();
    }
    load();
  }, []);

  // if initial load and with no params, geolocate on load
  const searchParamsCount = Array.from(searchParams.entries()).length;
  if (
    initialLoad &&
    geolocateOnLoad &&
    !allResultsOnLoad &&
    searchParamsCount == 0
  ) {
    autoGeolocate();
  }

  const vertical = useSearchState((state) => state.vertical);
  const verticalResults = vertical.results;
  const allResultsForVertical =
    vertical?.noResults?.allResultsForVertical.results;

  if (initialLoad && allResultsOnLoad) return allResults;

  const results = verticalResults?.length
    ? verticalResults
    : displayAllOnNoResults
    ? allResultsForVertical
    : [];

  return results as Result<T>[];
}
