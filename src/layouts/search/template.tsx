import { getRuntime } from "@yext/pages/util";
import { SearchHeadlessProvider } from "@yext/search-headless-react";
import { BrowserRouter } from "react-router-dom";
import Locator from "src/components/search/Locator";
import { getSearchProvider } from "src/config";
import { SearchPageProfile, TemplateRenderProps } from "src/types/entities";
import { Template } from "@yext/pages";
import "src/index.css";
import { Main } from "src/layouts/main";
import { useEffect, useState } from "react";

interface SearchLayoutProps {
  data: TemplateRenderProps<SearchPageProfile>;
}

const SearchLayout = ({ data }: SearchLayoutProps) => {
  const { document } = data;
  const { c_searchTitle, c_searchSubTitle, c_searchPlaceholderText, _site } =
    document;

  const runtime = getRuntime();
  const searcher = getSearchProvider(
    "6c7da37b7336cfc204cbde09bcbd0275",
    document.meta.locale,
    document.siteDomain
  );

  const [inBrowser, setInBrowser] = useState<boolean>(false);
  useEffect(() => {
    setInBrowser(true);
  }, []);

  // if (!YEXT_PUBLIC_SEARCH_EXPERIENCE_API_KEY) {
  //   console.error(
  //     "Add a search experience API key to the .env file or as a site variable to enable the Locator component."
  //   );
  // }

  return (
    <>
      <SearchHeadlessProvider searcher={searcher}>
        {runtime.name === "browser" && inBrowser && (
          <BrowserRouter>
            <Locator
              title={c_searchTitle || "Retail Store Locations"}
              subTitle={
                c_searchSubTitle || "Search by city and state or ZIP code"
              }
              placeholderText={
                c_searchPlaceholderText ||
                "Search by city and state or ZIP code"
              }
              geolocateOnLoad={true}
            />
          </BrowserRouter>
        )}
      </SearchHeadlessProvider>
    </>
  );
};

/**
 * This is the main template. It can have any name as long as it"s the default export.
 * The props passed in here are the direct result from `getStaticProps`.
 */
const Search: Template<TemplateRenderProps<SearchPageProfile>> = (data) => {
  return (
    <Main data={data} hideFooter={true}>
      <SearchLayout data={data} />
    </Main>
  );
};

export default Search;
