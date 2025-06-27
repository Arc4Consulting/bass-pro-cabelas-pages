import {
  SchemaWrapper,
  OpeningHours,
  FAQPage,
  BaseSchema,
  Address,
  LocalBusiness,
} from "@yext/schema-wrapper";
import { ComplexImage } from "@yext/types";
import type { TemplateRenderProps } from "src/types/entities";

export function SchemaBuilder(
  data: TemplateRenderProps<Record<string, any>>
): string {
  const profile = data.document;
  const sportingGoodsStore = profile.address
    ? {
        ...LocalBusiness(data, "SportingGoodsStore"),
        "@id": data.relativePrefixToRoot + profile.slug,
        url: data.relativePrefixToRoot + profile.slug,
        name: `${profile.name} ${
          profile.geomodifier
            ? profile.geomodifier
            : profile.address.city + ", " + profile.address.region
        }`,
        image: profile.c_heroImage1?.url,
        makesOffer: (profile.services ?? []).concat(
          (profile.c_storeServiceList1 ?? []).map((service: ComplexImage) => {
            return {
              url: service.clickthroughUrl,
              description: service.description,
              image: service.image?.url,
            };
          })
        ),
      }
    : null;

  const breadcrumbs = profile.dm_directoryParents_bassprodirectory
    ? (
        profile.dm_directoryParents_bassprodirectory as Array<{
          slug: string;
          name: string;
        }>
      ).map((parent, idx) => ({
        "@type": "ListItem",
        name: parent.name,
        position: idx + 1,
        item: {
          "@type": "Thing",
          "@id": data.relativePrefixToRoot + parent.slug,
        },
      }))
    : null;

  const faqData = [
    { question: profile.c_question1, answer: profile.c_answer1 },
    { question: profile.c_question2, answer: profile.c_answer2 },
    { question: profile.c_question3, answer: profile.c_answer3 },
    { question: profile.c_question4, answer: profile.c_answer4 },
    { question: profile.c_question5, answer: profile.c_answer5 },
    { question: profile.c_question6, answer: profile.c_answer6 },
  ].filter((link) => link.question && link.answer);

  const faqs = faqData ? FAQPage(faqData) : null;

  const json = {
    "@graph": [
      sportingGoodsStore && sportingGoodsStore,
      faqs && faqs,
      breadcrumbs && {
        "@context": "http://www.schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs,
      },
    ],
  };

  return SchemaWrapper(json);
}
