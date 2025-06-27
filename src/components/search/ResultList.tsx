import { useEffect, useRef } from "react";
import classNames from "classnames";
import type { CardComponent } from "@yext/search-ui-react";
import type { Result } from "@yext/search-headless-react";
import { useLocator } from "src/components/search/utils/useLocator";
import type { LocatorCardProps } from "src/components/cards/LocatorCard";
import "src/components/search/ResultList.css";
import { LocationProfile } from "src/types/entities";
import { Link } from "@yext/pages-components";
import { useTemplateData } from "src/common/useTemplateData";
import { useSearchState } from "@yext/search-headless-react";
interface ResultListProps extends LocatorCardProps {
  CardComponent: CardComponent<LocationProfile>;
  pin: any;
}

const ResultList = (props: ResultListProps) => {
  const { CardComponent, pin } = props;
  const { relativePrefixToRoot } = useTemplateData();
  const state = useSearchState((s) => s);
  const initialLoad = !state.query.queryId;
  const { results } = useLocator();

  return (
    <div className="ResultList flex flex-col gap-4">
      {results?.length ? (
        results?.map((result) => (
          <ResultListItem
            key={result.id || result.index}
            CardComponent={CardComponent}
            result={result}
            pin={pin}
          />
        ))
      ) : initialLoad ? (
        <></>
      ) : (
        <div className="flex flex-col w-full items-center text-sm font-tertiary font-bold text-brand-gray-900">
          <span className="mb-[10px]">
            Can't find the store you're looking for?
          </span>
          <Link
            className="text-white bg-brand-green-500 font-primary text-lg py-2 px-4 rounded-[5px] leading-1 hover:bg-brand-green-600"
            href={relativePrefixToRoot + "index.html"}
          >
            Browse all locations
          </Link>
        </div>
      )}
    </div>
  );
};

interface ResultListItemProps {
  CardComponent: CardComponent<LocationProfile>;
  result: Result<LocationProfile>;
  pin: any;
}

function ResultListItem(props: ResultListItemProps) {
  const { CardComponent, result, pin } = props;
  const {
    selectedId,
    setSelectedId,
    hoveredId,
    setHoveredId,
    focusedId,
    setFocusedId,
  } = useLocator();
  const listItemRef = useRef<HTMLDivElement | null>(null);

  // When the selectedId is updated from a marker click scroll the ResultList to show the current LocatorCard
  useEffect(() => {
    if (selectedId === result.id) {
      listItemRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedId, result.id]);

  return (
    <div
      ref={listItemRef}
      className={classNames(
        "ResultList-item bg-white shadow-card-shadow hover:shadow-card-hover hover:cursor-pointer font-secondary flex justify-between",
        { "is-selected": selectedId === result.id },
        {
          "is-hovered": hoveredId === result.id || focusedId === result.id,
        }
      )}
      onClick={() => setSelectedId(result.id ?? "")}
      onFocus={() => setFocusedId(result.id ?? "")}
      onBlur={() => setFocusedId("")}
      onMouseEnter={() => setHoveredId(result.id ?? "")}
      onMouseLeave={() => setHoveredId("")}
    >
      <div
        className={classNames("flex flex-col shrink-1 pr-4", {
          "text-brand-green-500": result.name != "Cabela's",
          "text-brand-blue-500": result.name == "Cabela's",
        })}
      >
        <span className="text-black">{result.index}</span>
        <span className="w-4 h-4">{pin}</span>
      </div>
      <CardComponent result={result} />
    </div>
  );
}

export default ResultList;
