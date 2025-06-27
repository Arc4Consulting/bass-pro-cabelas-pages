import type { Stream, TemplateConfig } from "@yext/pages";

/**
 * Required when Knowledge Graph data is used for a template.
 */
export const configBuilder: (
  id?: string,
  filter?: Stream["filter"]
) => TemplateConfig = (id?: string, filter?: Stream["filter"]) => ({
  stream: {
    $id: id || "directory-root",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",
      "c_meta",
      // Directory List Fields
      "dm_directoryParents_bassprodirectory.slug",
      "dm_directoryParents_bassprodirectory.name",
      "dm_directoryChildren.address",
      "dm_directoryChildren.geomodifier",
      "dm_directoryChildren.hours",
      "dm_directoryChildren.c_storeBrand",
      "dm_directoryChildren.ref_listings.listingUrl",
      "dm_directoryChildren.ref_listings.publisher",
      "dm_directoryChildren.googlePlaceId",
      "dm_directoryChildren.mainPhone",
      "dm_directoryChildren.slug",
      "dm_directoryChildren.name",
      "dm_directoryChildren.id",
      "dm_directoryChildren.yextDisplayCoordinate",
      "dm_directoryChildren.c_exteriorLocationPhoto",
      "dm_directoryChildren.c_pagesURL",
      "dm_directoryChildren.c_pagesURLCabelas",
      "dm_directoryChildren.timezone",
      "dm_directoryChildren.websiteUrl",
      "c_pagesMetaTitle",
      "c_pagesMetaDescription",
    ],
    // Defines the scope of entities that qualify for this stream.
    filter: filter || {
      savedFilterIds: ["dm_bassProDirectory"],
    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
    },
  },
});
