/**
 * This file generates redirects for cabelas location entities
 */
import {
  GetDestination,
  GetSources,
  TemplateConfig,
  TemplateProps,
} from "@yext/pages";

export const config: TemplateConfig = {
  stream: {
    $id: "locations-redirects",
    fields: ["id", "name", "c_oldPagesURL", "c_redirectPagesURL", "c_pagesURL"],
    filter: {
      savedFilterIds: ["1328110808"],
    },
    localization: {
      locales: ["en"],
    },
  },
};

/**
 * Defines the destination URL for all redirects configured in this file
 * All getSources paths redirect to this value.
 */
export const getDestination: GetDestination<TemplateProps> = ({ document }) => {
  return `${document.c_pagesURL}`;
};

/**
 * Generates source URL paths that will redirect to the URL in getDestination.
 * In this example, each source path is defined by each entity's slug value
 */
export const getSources: GetSources<TemplateProps> = ({ document }) => {
  if (document.c_redirectPagesURL) {
    const oldPagesURL = document.c_oldPagesURL as string;
    const path = oldPagesURL.replace("https://stores.cabelas.com/", "");
    return [
      {
        source: `${path}`,
        statusCode: 301, // Indicates a permanent redirect
      },
    ];
  }
  return [];
};
