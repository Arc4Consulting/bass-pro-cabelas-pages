import type { TemplateRenderProps, HeadConfig, Tag } from "@yext/pages";
import { SchemaBuilder } from "src/common/schema";
import faviconBasspro from "src/assets/images/favicon-basspro.ico";
import faviconCabelas from "src/assets/images/favicon-cabelas.ico";

const dnsPrefetchTags: Tag[] = [
  {
    type: "link",
    attributes: { rel: "dns-prefetch", href: "//www.yext-pixel.com" },
  },
  {
    type: "link",
    attributes: { rel: "dns-prefetch", href: "//a.cdnmktg.com" },
  },
  {
    type: "link",
    attributes: { rel: "dns-prefetch", href: "//a.mktgcdn.com" },
  },
  {
    type: "link",
    attributes: { rel: "dns-prefetch", href: "//dynl.mktgcdn.com" },
  },
  {
    type: "link",
    attributes: { rel: "dns-prefetch", href: "//dynm.mktgcdn.com" },
  },
  {
    type: "link",
    attributes: { rel: "dns-prefetch", href: "//www.google-analytics.com" },
  },
];

const defaultHeadTags: Tag[] = [
  {
    type: "meta",
    attributes: {
      "http-equiv": "X-UA-Compatible",
      content: "IE=edge",
    },
  },
  ...dnsPrefetchTags,
  {
    type: "meta",
    attributes: {
      name: "format-detection",
      content: "telephone=no",
    },
  },
  {
    type: "meta",
    attributes: {
      property: "og:type",
      content: "website",
    },
  },
  {
    type: "meta",
    attributes: {
      property: "twitter:card",
      content: "summary",
    },
  },
];

export function defaultHeadConfig(
  data: TemplateRenderProps,
  additionalTags?: Tag[]
): HeadConfig {
  const logoTags: Tag[] = data.document?.logo
    ? [
        {
          type: "meta",
          attributes: {
            property: "og:image",
            content: data.document.logo.image.url,
          },
        },
      ]
    : [];

  const geoTags: Tag[] = data.document?.yextDisplayCoordinate
    ? [
        {
          type: "meta",
          attributes: {
            name: "geo.position",
            content: `${data.document.yextDisplayCoordinate.lat},${data.document.yextDisplayCoordinate.long}`,
          },
        },
      ]
    : [];
  const addressTags: Tag[] = data.document.address
    ? [
        {
          type: "meta",
          attributes: {
            name: "geo.placename",
            content: `${data.document.address.city},${
              data.document.address.localizedRegionName ||
              data.document.address.region
            }`,
          },
        },
        {
          type: "meta",
          attributes: {
            name: "geo.region",
            content: `${data.document.address.countryCode}-${data.document.address.region}`,
          },
        },
      ]
    : [];

  return {
    title: metaTitle(data),
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: metaDescription(data),
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:title",
          content: metaTitle(data),
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:description",
          content: metaDescription(data),
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:url",
          content: canonicalUrl(data),
        },
      },
      {
        type: "link",
        attributes: {
          rel: "canonical",
          href: canonicalUrl(data),
        },
      },
      {
        type: "link",
        attributes: {
          rel: "shortcut icon",
          type: "image/ico",
          href: favicon(data),
        },
      },
      ...logoTags,
      ...defaultHeadTags,
      ...geoTags,
      ...addressTags,
      ...(additionalTags || []),
    ],
    other: [
      yaScript(),
      SchemaBuilder(data),
      yextEntityData(data),
      adobeScript(data),
      hotjarScript(),
      monetateScript(),
    ].join("\n"),
  };
}

function yaScript(): string {
  return `<script>window.yextAnalyticsEnabled=false;window.enableYextAnalytics=()=>{window.yextAnalyticsEnabled=true}</script>`;
}

function adobeScript(data: TemplateRenderProps): string {
  if (data.document._site?.c_brand == "Basspro") {
    return `<script src="//assets.adobedtm.com/73e21ea9c8f9/57a94a18729e/launch-f561fce87826.min.js" async></script>`;
  } else {
    return `<script src="//assets.adobedtm.com/73e21ea9c8f9/2b293220a653/launch-c2d7d885ed37.min.js" async></script>`;
  }
}

function hotjarScript(): string {
  return ` <!-- Hotjar Tracking Code for https://stores.basspro.com -->
    <script>
    (function(h,o,t,j,a,r){
      h.hj = h.hj || function(){(h.hj.q=h.hj.q || [] ).push(arguments)};
      h._hjSettings={hjid:2951005, hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script'); r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>`;
}

function monetateScript(): string {
  return ` <!-- Begin Monetate ExpressTag Sync v8.1. Place at start of document head. DO NOT ALTER. -->
    <script type="text/javascript">var monetateT = new Date().getTime();</script>
    <script type="text/javascript" src="//se.monetate.net/js/2/a-806733e3/p/stores.basspro.com/entry.js"></script>
    <!-- End Monetate tag. -->`;
}

// Script for passing entity ID to yextension
function yextEntityData(data: TemplateRenderProps): string {
  return `<script id="yext-entity-data" data-entity-id="${data.document.uid}"></script>`;
}

function favicon(data: TemplateRenderProps): string {
  const { c_brand } = data.document._site;
  if (c_brand == "Basspro") return faviconBasspro;
  return faviconCabelas;
}

function metaTitle(data: TemplateRenderProps): string {
  // 1. Check for meta field on the entity
  const { c_pagesMetaTitle } = data.document;
  if (c_pagesMetaTitle) return c_pagesMetaTitle;

  // if you want to return some hard coded string for specific page types:
  // if (data.document.meta.entityType.id == "location") {
  //   const profile = data.document;
  //   return `${profile.name} at ${profile.address.line1}`;
  // }

  return "";
}

function metaDescription(data: TemplateRenderProps): string {
  // 1. Check for meta field on the entity
  const { c_pagesMetaDescription } = data.document;
  if (c_pagesMetaDescription) return c_pagesMetaDescription;

  // 2. Check for breadcrumbs
  const { dm_directoryParents_bassprodirectory } = data.document;
  if (dm_directoryParents_bassprodirectory) {
    return `${dm_directoryParents_bassprodirectory
      .map((crumb: { name: string }) => crumb.name)
      .join(", ")}.`;
  }

  return "";
}

function canonicalUrl(data: TemplateRenderProps): string {
  let pagePath = data.path;

  if (pagePath === "index.html") {
    pagePath = "";
  }

  return `https://${data.document.siteDomain}/${pagePath}`;
}
