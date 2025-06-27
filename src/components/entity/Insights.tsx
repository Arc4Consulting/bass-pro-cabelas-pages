import type { CTA, ComplexImage } from "@yext/types";
import type { Insight, LocationProfile } from "src/types/entities";
import { InsightCard } from "src/components/cards/InsightCard";
import { Link } from "@yext/pages-components";
import { useTemplateData } from "src/common/useTemplateData";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import classNames from "classnames";
import { getBrand } from "src/common/helpers";

const Insights = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;
  const categories = [
    profile.c_category1,
    profile.c_category2,
    profile.c_category3,
    profile.c_category4,
    profile.c_category5,
    profile.c_category6,
    profile.c_category7,
    profile.c_category8,
    profile.c_category9,
  ].filter((category) => category?.image) as ComplexImage[];

  if (categories.length > 0) {
    return (
      <ErrorBoundaryWithAnalytics name="category">
        <InsightsLayout
          title={profile.c_categoryTitle ?? "Shop By Category"}
          insights={categories}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

interface InsightsLayoutProps {
  title: string;
  insights: ComplexImage[];
}

const InsightsLayout = (props: InsightsLayoutProps) => {
  const { title, insights } = props;

  return (
    <div className="Insights py-8">
      <div className="legacy-container">
        <h2
          className={classNames(
            "Heading Heading--head pb-4 lg:pb-8 text-center text-brand-green-300"
          )}
        >
          {title}
        </h2>
        {insights.length && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((item, i) => (
              <div key={i} className="pb-4 sm:px-4 lg:pb-8">
                <InsightCard image={item} index={i + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
