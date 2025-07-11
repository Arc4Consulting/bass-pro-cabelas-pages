import { useState, useEffect } from "react";
import { useSearchActions } from "@yext/search-headless-react";
import { useBreakpoint } from "src/common/useBreakpoints";
import { MdFilterList } from "react-icons/md";
import ResultSummary from "src/components/search/ResultSummary";
import FacetsModal from "src/components/search/FacetsModal";
import ActiveFacets from "src/components/search/ActiveFacets";

const ResultInfo = (props: { pin: any }) => {
  const isDesktop = useBreakpoint("sm");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Close facet modal when 'esc' key is pressed.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="">
      <div className="flex font-tertiary text-xs gap-4 pb-4 lg:hidden">
        <div className="flex gap-1">
          <div className="h-[18px] w-[20px] pr-[5px] text-brand-green-500 my-auto">
            {props.pin}
          </div>
          <div className="my-auto">Bass Pro Shops</div>
        </div>
        <div className="flex gap-1">
          <div className="h-[18px] w-[20px] pr-[5px] text-[#0058a0] my-auto">
            {props.pin}
          </div>
          <div className="my-auto">Cabela's</div>
        </div>
      </div>
      {filtersOpen && !isDesktop && (
        <div
          className="fixed top-0 left-0 h-screen w-screen opacity-30 bg-black z-10"
          onClick={() => setFiltersOpen(false)}
        ></div>
      )}
      <div className="flex items-center mb-4">
        <ResultSummary />
        <FiltersButton
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
        />
      </div>
      {isDesktop && <ActiveFacets />}
      {filtersOpen && <FacetsModal setFiltersOpen={setFiltersOpen} />}
    </div>
  );
};

type FiltersButtonProps = {
  filtersOpen: boolean;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FiltersButton = (props: FiltersButtonProps) => {
  const searchActions = useSearchActions();
  const facets = searchActions.state.filters.facets;
  const facetsAvailable = facets?.filter((facet) => facet.options.length).length
    ? true
    : false;
  const numActiveFacets = facets
    ?.map((facet) => facet.options.filter((f) => f.selected).length)
    .reduce((prev, curr) => prev + curr, 0);

  if (!facetsAvailable) return null;

  return (
    <button
      className="flex items-center ml-auto"
      onClick={() => props.setFiltersOpen(!props.filtersOpen)}
    >
      <span className="text-brand-primary mr-2.5 whitespace-nowrap">
        {`Filters ${numActiveFacets ? `(${numActiveFacets})` : ""}`}
      </span>
      <MdFilterList className="text-brand-primary" />
    </button>
  );
};

export default ResultInfo;
