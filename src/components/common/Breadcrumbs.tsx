import { ReactNode } from "react";
import classNames from "classnames";
import { useTemplateData } from "src/common/useTemplateData";
import ErrorBoundaryWithAnalytics from "./ErrorBoundaryWithAnalytics";
import { MaybeLink } from "./MaybeLink";
import { getBrand } from "src/common/helpers";

interface BreadcrumbsPropsDefault {
  breadcrumbs: Array<{ slug: string; name: string }>;
  separator?: ReactNode;
  className?: string;
}

/*
 * The 'Breadcrumbs' component renders a breadcrumbs style navigation bar
 *
 * @example
 * ```
 * <Breadcrumbs breadcrumbs={defaultTransformer(streamBreadcrumbs)} />
 * ```
 *
 * @param {[{name: string, slug: string}]} breadcrumbs
 *          List of {crumbName, crumbUrl}
 * @param {ReactElement | string} separator
 *          between each breadcrumb - defaults to '/', also accepts any HTML element (<svg>, <img>, etc)
 */
const Breadcrumbs = (props: BreadcrumbsPropsDefault) => {
  const { breadcrumbs, className, separator = "/" } = props;
  const { relativePrefixToRoot } = useTemplateData();

  return (
    <ErrorBoundaryWithAnalytics name="breadcrumbs">
      {breadcrumbs?.length && (
        <nav
          className={classNames("Breadcrumbs my-4 w-full", className)}
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap">
            {breadcrumbs.map(({ name, slug }, idx) => {
              const isLast = idx === breadcrumbs.length - 1;

              return (
                <li key={idx}>
                  <Breadcrumb
                    name={name}
                    slug={isLast ? "" : relativePrefixToRoot + slug}
                    index={idx}
                    {...props}
                  />
                  {!isLast && (
                    <span className="mx-2 text-brand-gray-600">
                      {separator}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </ErrorBoundaryWithAnalytics>
  );
};

interface BreadcrumbProps {
  name: string;
  slug?: string;
  index: number;
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { name, slug } = props;

  return (
    <MaybeLink
      className={classNames(
        "Link--breadcrumbs Link--underline",
        {
          "text-brand-green-300 hover:text-brand-green-400":
            getBrand() == "Basspro",
        },
        {
          "text-brand-green-300 hover:text-brand-green-200":
            getBrand() != "Basspro",
        }
      )}
      href={slug}
      eventName={`link${props.index}`}
    >
      <span className="font-secondary text-sm">{name}</span>
    </MaybeLink>
  );
};

export default Breadcrumbs;
