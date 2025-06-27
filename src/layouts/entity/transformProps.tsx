import type {
  LocationProfile,
  ReviewProfile,
  TemplateRenderProps,
} from "src/types/entities";
import type { TransformProps } from "@yext/pages";
import { formatPhone } from "src/common/helpers";
import "src/index.css";
import { getTranslations } from "../../i18n";
import { useEffect, useState } from "react";
import { fetchReviews } from "src/components/entity/utils/fetchReviews";

/**
 * Required only when data needs to be retrieved from an external (non-Knowledge Graph) source.
 * If the page is truly static this function is not necessary.
 *
 * This function will be run during generation and pass in directly as props to the default
 * exported function.
 */
export const transformProps: TransformProps<
  TemplateRenderProps<LocationProfile>
> = async (data) => {
  const {
    mainPhone,
    fax,
    tollFreePhone,
    mobilePhone,
    ttyPhone,
    localPhone,
    alternatePhone,
    address,
    // dm_directoryParents_defaultdirectory,
    name,
    id,
  } = data.document;

  if (data.document._site.c_brand == "Basspro") {
    (data.document.dm_directoryParents_bassprodirectory || []).push({
      name: address.line1,
      slug: "",
    });
  } else {
    (data.document.dm_directoryParents_cabelasdirectory || []).push({
      name: address.line1,
      slug: "",
    });
  }

  const translations = await getTranslations(data.document.locale);

  return {
    ...data,
    document: {
      ...data.document,
      t_mainPhone: mainPhone
        ? {
            label: formatPhone(mainPhone, address.countryCode) || mainPhone,
            href: `tel:${mainPhone}`,
            raw: mainPhone,
          }
        : undefined,
      fax: formatPhone(fax, address.countryCode),
      tollFreePhone: formatPhone(tollFreePhone, address.countryCode),
      mobilePhone: formatPhone(mobilePhone, address.countryCode),
      ttyPhone: formatPhone(ttyPhone, address.countryCode),
      localPhone: formatPhone(localPhone, address.countryCode),
      alternatePhone: formatPhone(alternatePhone, address.countryCode),
      dm_directoryParents:
        data.document._site.c_brand == "Basspro"
          ? data.document.dm_directoryParents_bassprodirectory
          : data.document.dm_directoryParents_cabelasdirectory,
    },
    translations,
  };
};
