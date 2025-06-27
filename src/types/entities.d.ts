import {
  TemplateProps as InternalTemplateProps,
  TemplateRenderProps as InternalTemplateRenderProps,
} from "@yext/pages/*";
import type { ListingType } from "@yext/pages-components";
import type {
  Address,
  Coordinate,
  CTA,
  Hours,
  Image,
  ComplexImage,
  WebsiteUrl,
} from "@yext/types";
import type { Resource } from "i18next";

// TODO: potentially move this to @yext/types
// Also we should probably move @yext/types into @yext/pages
// since they're specific to pages streams, not generic kg types
interface BaseProfile {
  readonly id: string;
  readonly businessId: number;
  readonly locale: string;
  readonly siteDomain: string;
  readonly siteId: number;
  readonly siteInternalHostname: string;
  readonly uid: number;
  readonly meta: {
    readonly entityType: {
      readonly id: string;
      readonly uid: number;
    };
    readonly locale: string;
  };
  readonly _site: SiteProfile;
}

export interface SiteProfile extends BaseProfile {
  readonly name: string;
  readonly c_brand?: string;
  readonly c_copyrightMessage?: string;
  readonly c_logoURL?: string;
  readonly c_instagram?: string;
  readonly c_twitter?: string;
  readonly c_pinterest?: string;
  readonly c_youtube?: string;
  readonly c_facebook?: string;
  readonly c_footerLinks?: CTA[];
  readonly c_header?: {
    readonly logo?: Image;
    readonly logoLink?: string;
    readonly links?: CTA[];
  };
  readonly c_searchPage?: {
    readonly slug?: string;
  };
  readonly c_nearbySectionAPIKey?: string;
}

export interface ProductProfile extends BaseProfile {
  readonly name: string;
  readonly primaryPhoto: ComplexImage;
  readonly richTextDescription: string;
  readonly c_primaryCTA: CTA;
}

export interface SearchPageProfile extends BaseProfile {
  readonly slug: string;
  readonly c_searchTitle?: string;
  readonly c_searchSubTitle?: string;
  readonly c_searchPlaceholderText?: string;
}

export interface EventDate {
  readonly end: string;
  readonly start: string;
}

export interface EventProfile extends BaseProfile {
  readonly name: string;
  readonly time: EventDate;
  readonly description?: string;
  readonly c_primaryCTA?: CTA;
  readonly photoGallery?: ComplexImage[];
  readonly c_eventType?: string;
}

export interface FinancialProfessionalProfile extends BaseProfile {
  readonly id: string;
  readonly name: string;
  readonly headshot?: Image;
  readonly mainPhone?: string;
  readonly t_mainPhone?: PhoneData;
  readonly c_occupation?: string;
  readonly emails?: string[];
  readonly websiteUrl?: WebsiteUrl;
}

interface Insight {
  readonly title: string;
  readonly category?: string;
  readonly photo?: Image;
  readonly date?: string;
  readonly descriptionLong: string;
  readonly descriptionShort?: string;
  readonly cta: CTA;
}

interface PhoneData {
  readonly label: string;
  readonly href: string;
  readonly raw: string;
}

// TODO: generate these automatically from stream definitions
export interface LocationProfile extends BaseProfile {
  readonly name: string;
  readonly address: Address;
  readonly yextDisplayCoordinate: Coordinate;
  readonly slug: string;
  readonly hours?: Hours;
  readonly geomodifier?: string;
  readonly c_boatAndATVServiceHours?: Hours;
  readonly additionalHoursText?: string;
  readonly c_additionalHoursUnderRegularHours?: string;
  readonly mainPhone?: string;
  readonly t_mainPhone?: PhoneData;
  readonly t_reviewRating?: number;
  readonly t_reviewCount?: number;
  readonly t_reviews?: ReviewProfile[];
  readonly calendars?: {
    readonly ids: {
      readonly name?: string;
    }[];
  };
  readonly fax?: string;
  readonly tollFreePhone?: string;
  readonly mobilePhone?: string;
  readonly ttyPhone?: string;
  readonly localPhone?: string;
  readonly alternatePhone?: string;
  readonly description?: string;
  readonly emails?: string[];
  readonly services: string[];
  readonly photoGallery: ComplexImage[];
  readonly googlePlaceId?: string;
  readonly ref_listings?: ListingType[];
  readonly logo?: Image;
  readonly paymentOptions?: string;
  readonly c_geomodifier?: string;
  readonly c_fAQTitle?: string;
  readonly c_question1?: string;
  readonly c_question2?: string;
  readonly c_question3?: string;
  readonly c_question4?: string;
  readonly c_question5?: string;
  readonly c_question6?: string;
  readonly c_answer1?: string;
  readonly c_answer2?: string;
  readonly c_answer3?: string;
  readonly c_answer4?: string;
  readonly c_answer5?: string;
  readonly c_answer6?: string;
  readonly c_employmentPromoTitle?: string;
  readonly c_employmentPromoDescription?: string;
  readonly c_employmentPromoButtonText?: string;
  readonly c_employmentPromoButtonURl?: string;
  readonly c_aboutStoreSubhead?: string;
  readonly c_pagesBusinessDescription?: string;
  readonly c_promotionImage2?: ComplexImage;
  readonly c_categoryTitle?: string;
  readonly c_category1?: ComplexImage;
  readonly c_category2?: ComplexImage;
  readonly c_category3?: ComplexImage;
  readonly c_category4?: ComplexImage;
  readonly c_category5?: ComplexImage;
  readonly c_category6?: ComplexImage;
  readonly c_category7?: ComplexImage;
  readonly c_category8?: ComplexImage;
  readonly c_category9?: ComplexImage;
  readonly c_category10?: ComplexImage;
  readonly c_category11?: ComplexImage;
  readonly c_promotionCarouselList?: ComplexImage[];
  readonly c_pickupLabel?: string;
  readonly c_curbside_pickup?: string;
  readonly c_shopNowButtonURL?: string;
  readonly c_shopNowButtonText?: string;
  readonly c_teamLabel?: string;
  readonly c_restaurantManager?: string;
  readonly c_storeManagerTitle3?: string;
  readonly c_restaurantEmail?: string;
  readonly c_storeManagerEmailText3?: string;
  readonly c_tmbcManager?: string;
  readonly c_tmbcEmail?: string;
  readonly c_storeManagerTitle2?: string;
  readonly c_storeManagerEmailText2?: string;
  readonly c_storeManager?: string;
  readonly c_storeManagerTitle1?: string;
  readonly c_storeManagerEmailText1?: string;
  readonly c_connectWithUsLabel?: string;
  readonly c_hoursLabel?: string;
  readonly c_signUpLinkText?: string;
  readonly c_formURL?: string;
  readonly c_pagesMetaDescription?: string;
  readonly c_pagesMetaTitle?: string;
  readonly c_trackerBoatLogo?: Image;
  readonly c_exteriorLocationPhoto?: Image;
  readonly c_restaurantLogos?: Image[];
  readonly c_salesLabel?: string;
  readonly c_thisStoreLabel?: string;
  readonly c_storeBrand?: string;
  readonly c_serviceLabel?: string;
  readonly c_boatSalesHoursHeading?: string;
  readonly c_servicesThisStore?: string[];
  readonly c_storeServiceList1?: ComplexImage[];
  readonly c_heroImage1?: Image;
  readonly c_pagesURLCabelas?: string;
  readonly c_pagesURL?: string;
  readonly timezone: string;
  readonly c_additionalHoursADMIN?: string;
  readonly c_additionalHoursLabel3?: string;
  readonly c_boatAndATVServiceHeading?: string;
  readonly facebookPageUrl?: string;
  readonly websiteUrl?: WebsiteUrl;

  // Add custom fields here
  // c_myStringField: string
  readonly c_eventsSection?: {
    readonly title?: string;
    readonly events?: EventProfile[];
  };
  readonly c_bannerSection?: {
    readonly text?: string;
    readonly image?: Image;
  };
  readonly c_heroSection?: {
    readonly background?: Image;
    readonly cta1?: CTA;
    readonly cta2?: CTA;
  };
  readonly c_featuredProductsSection?: {
    readonly title?: string;
    readonly products?: ProductProfile[];
  };
  readonly c_promoSection?: {
    readonly title?: string;
    readonly description?: string;
    readonly image?: Image;
    readonly cta?: CTA;
    readonly googlePlayUrl?: string;
    readonly appStoreUrl?: string;
  };
  readonly c_gallerySection?: {
    readonly title?: string;
    readonly images?: Image[];
  };
  readonly c_aboutSection?: {
    readonly title?: string;
    readonly description?: string;
    readonly image?: Image;
    readonly cta?: CTA;
  };
  readonly c_teamSection?: {
    readonly title?: string;
    readonly team?: FinancialProfessionalProfile[];
  };
  readonly c_faqSection?: {
    readonly title?: string;
    readonly faqs?: FAQProfile[];
  };
  readonly c_nearbySection?: {
    readonly title?: string;
    readonly linkToLocator?: boolean;
    readonly cta?: CTA;
  };
  readonly c_insightsSection?: {
    readonly title?: string;
    readonly cta?: CTA;
    readonly insights?: Insight[];
  };
  readonly c_reviewsSection?: {
    readonly title?: string;
    readonly reviews?: ReviewProfile[];
  };
  readonly dm_directoryParents_bassprodirectory?: Array<{
    slug: string;
    name: string;
  }>;
  readonly dm_directoryParents_cabelasdirectory?: Array<{
    slug: string;
    name: string;
  }>;

  readonly c_linkedEventEntity?: EventsProfile[];
  readonly c_staffSectionTitle?: string;
  readonly c_linkedEntity?: BiosProfile[];
  readonly c_localPartnersTitle?: string;
  readonly c_localPartners?: ComplexImage[];
}

export interface EventsProfile extends BaseProfile {
  readonly name?: string;
  readonly photoGallery?: Image[];
  readonly websiteUrl?: {
    displayUrl?: string;
    url?: string;
  };
  readonly time?: {
    start?: string;
    end?: string;
  };
  readonly description?: string;
  readonly c_eventType?: string;
}

export interface BiosProfile extends BaseProfile {
  readonly c_bioPhoto?: Image;
  readonly description?: string;
  readonly name?: string;
  readonly c_affiliationsAndCertifications?: string[];
  readonly services?: string[];
}

export type DirectoryProfile<T> = BaseProfile & {
  readonly name: string;
  readonly c_pagesMetaDescription: string;
  readonly c_pagesMetaTitle: string;
  readonly dm_baseEntityCount: number;
  readonly dm_directoryChildren?: T[];
  readonly dm_directoryParents_bassprodirectory?: Array<{
    slug: string;
    name: string;
  }>;
  readonly dm_directoryParents_cabelasdirectory?: Array<{
    slug: string;
    name: string;
  }>;
  readonly slug: string;
};

export interface FAQProfile extends BaseProfile {
  readonly question: string;
  readonly answer: string;
}

export interface ReviewProfile {
  apiIdentifier: string;
  authorName: string;
  comments?: {
    authorName: string;
    commentDate: string;
    commentId: number;
    content: string;
  }[];
  content: string;
  entity: {
    id: string;
  };
  rating: number;
  reviewDate: string;
}

export type TemplateProps<T = Record<string, unknown>> = Omit<
  InternalTemplateProps,
  "document"
> & {
  document: T;
};
export type TemplateRenderProps<T = Record<string, unknown>> = Omit<
  InternalTemplateRenderProps,
  "document"
> &
  TemplateProps<T> & {
    translations?: Resource;
  };

// The data returned by liveAPI has a slightly different meta property.
export type LiveAPIProfile<T = Record<string, unknown>> = Omit<T, "meta"> & {
  meta: {
    entityType: string;
    id: string;
    uid: string;
  };
};

export type ReviewStreamsResponse = {
  meta: {
    uuid: string;
    errors: {
      code: number;
      type: string;
      message: string;
    }[];
  };
  response: {
    nextPageToken: any;
    count: number;
    docs: ReviewProfile[];
  };
};
