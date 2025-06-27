/**
 * This is an example of how to create a template that makes use of streams data.
 * The stream data originates from Yext's Knowledge Graph. When a template in
 * concert with a stream is built by the Yext Sites system, a static html page
 * is generated for every corresponding (based on the filter) stream document.
 *
 * Another way to think about it is that a page will be generated using this
 * template for every eligible entity in your Knowledge Graph.
 */
import { LazyLoadWrapper } from "src/components/common/LazyLoadWrapper";
import type {
  LocationProfile,
  ReviewProfile,
  TemplateRenderProps,
} from "src/types/entities";

import Breadcrumbs from "src/components/common/Breadcrumbs";
import About from "src/components/entity/About";
import Banner from "src/components/entity/Banner";
import Core from "src/components/entity/Core";
import Events from "src/components/entity/Events";
import FAQs from "src/components/entity/FAQs";
import Gallery from "src/components/entity/Gallery";
import Hero from "src/components/entity/Hero";
import Insights from "src/components/entity/Insights";
import Nearby from "src/components/entity/Nearby";
import Products from "src/components/entity/Products";
import Promo from "src/components/entity/Promo";
import Reviews from "src/components/entity/Reviews";
import Team from "src/components/entity/Team";

import type { Template } from "@yext/pages";
import { Main } from "src/layouts/main";
import "src/index.css";
import { getBrand } from "src/common/helpers";
import Employment from "src/components/entity/Employment";
import Map from "src/components/entity/Map";
import { useEffect, useState } from "react";
import { fetchReviews } from "src/components/entity/utils/fetchReviews";
import Bios from "src/components/entity/Bios";
import UpcomingEvents from "src/components/entity/UpcomingEvents";
import LocalPartners from "src/components/entity/LocalPartners";

interface EntityLayoutProps {
  data: TemplateRenderProps<LocationProfile>;
}

const EntityLayout = ({ data }: EntityLayoutProps) => {
  const { _site, id } = data.document;
  const [reviews, setReviews] = useState<ReviewProfile[]>([]);
  const [count, setCount] = useState<number>();
  const [averageRating, setRating] = useState<number>();
  const apiKey = "3ee6aab7dd957ed57c30fbb22297a401";

  useEffect(() => {
    if (!apiKey) {
      console.error(
        "Add a Reviews API key to the .env file or as a site variable to enable the reviews component."
      );
      return;
    }
    fetchReviews(apiKey, id).then((r) => {
      setCount(r.count);
      setReviews(r.reviews || []);
      setRating(r.rating);
    });
  }, [apiKey, id]);

  return (
    <>
      <Banner hasCloseBtn={true} />
      <Core count={count} averageRating={averageRating} />
      <UpcomingEvents />
      <Gallery />
      <Insights />
      <Promo />
      <About />
      <Map />
      <FAQs />
      <LocalPartners />
      <Bios />
      <Employment />
      <LazyLoadWrapper>
        <Nearby />
      </LazyLoadWrapper>
      <Reviews averageRating={averageRating} reviews={reviews} />
      <Breadcrumbs
        breadcrumbs={
          getBrand() == "Basspro"
            ? data.document.dm_directoryParents_bassprodirectory || []
            : data.document.dm_directoryParents_cabelasdirectory || []
        }
        separator="/"
        className="legacy-container"
      />
    </>
  );
};

/**
 * This is the main template. It can have any name as long as it's the default export.
 * The props passed in here are the direct stream document defined by `config`.
 *
 * There are a bunch of custom components being used from the src/components folder. These are
 * an example of how you could create your own. You can set up your folder structure for custom
 * components any way you'd like as long as it lives in the src folder (though you should not put
 * them in the src/templates folder as this is specific for true template files).
 */
const Entity: Template<TemplateRenderProps<LocationProfile>> = (data) => {
  return (
    <Main data={data}>
      <EntityLayout data={data} />
    </Main>
  );
};

export default Entity;
