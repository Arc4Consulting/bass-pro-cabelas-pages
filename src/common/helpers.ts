import {
  parsePhoneNumberWithError,
  CountryCode,
  ParseError,
} from "libphonenumber-js";
import { useTemplateData } from "./useTemplateData";
import aquarium from "src/assets/images/service-icons/aquarium.svg";
import archeryRange from "src/assets/images/service-icons/archery-range.svg";
import archeryService from "src/assets/images/service-icons/archery-service.svg";
import baitShop from "src/assets/images/service-icons/bait-shop.svg";
import bargainCave from "src/assets/images/service-icons/bargain-cave.svg";
import boatCenter from "src/assets/images/service-icons/boat-center.svg";
import boatService from "src/assets/images/service-icons/boat-service.svg";
import boreSighting from "src/assets/images/service-icons/bore-sighting.svg";
import bowling from "src/assets/images/service-icons/bowling.svg";
import conferenceRoom from "src/assets/images/service-icons/conference-room.svg";
import deli from "src/assets/images/service-icons/deli.svg";
import dining from "src/assets/images/service-icons/dining.svg";
import dogFriendly from "src/assets/images/service-icons/dog-friendly.svg";
import fudgeNuts from "src/assets/images/service-icons/fudge-nuts.svg";
import gallery from "src/assets/images/service-icons/gallery.svg";
import gaming from "src/assets/images/service-icons/gaming.svg";
import generalStore from "src/assets/images/service-icons/general-store.svg";
import golf from "src/assets/images/service-icons/golf.svg";
import gunLibrary from "src/assets/images/service-icons/gun-library.svg";
import gunsmith from "src/assets/images/service-icons/gunsmith.svg";
import lineSpooling from "src/assets/images/service-icons/line-spooling.svg";
import mountainExhibit from "src/assets/images/service-icons/mountain-exhibit.svg";
import museum from "src/assets/images/service-icons/museum.svg";
import offRoadVehicleServicing from "src/assets/images/service-icons/off-road-vehicle-servicing.svg";
import offRoadVehicles from "src/assets/images/service-icons/off-road-vehicles.svg";
import pistolRange from "src/assets/images/service-icons/pistol-range.svg";
import preOwnedGuns from "src/assets/images/service-icons/pre-owned-guns.svg";
import rifleRange from "src/assets/images/service-icons/rifle-range.svg";
import rvParking from "src/assets/images/service-icons/rv-parking.svg";
import shootingGallery from "src/assets/images/service-icons/shooting-gallery.svg";

function dedupeStreamFields(allFields: string[]): string[] {
  return [...new Set(allFields)];
}

function getBrand(): string {
  const { document } = useTemplateData();

  return document._site.c_brand ?? "Basspro";
}

function getCountryName(abbr: string): string {
  const countryCodeToCountryName: { [code: string]: string } = {
    US: "United States",
    CA: "Canada",
  };
  return countryCodeToCountryName[abbr] ?? "";
}

function getRegionName(countryAbbr: string, abbr: string): string {
  const regionAbbrToRegionName = {
    US: {
      AL: "Alabama",
      AK: "Alaska",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DC: "District of Columbia",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      PR: "Puerto Rico",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
    },
    CA: {
      ON: "Ontario",
      BC: "British Columbia",
      MB: "Manitoba",
      QC: "Quebec",
      NB: "New Brunswick",
      SK: "Saskatchewan",
      NS: "Nova Scotia",
      AB: "Alberta",
      NL: "Newfoundland and Labrador",
    },
  };
  return regionAbbrToRegionName[countryAbbr][abbr] ?? abbr;
}

function getServiceIcon(name: string): string {
  switch (name) {
    case "aquarium":
      return aquarium;
    case "archery_range":
      return archeryRange;
    case "archery_service":
      return archeryService;
    case "bait_shop":
      return baitShop;
    case "bargain_cave":
      return bargainCave;
    case "boat_center":
    case "boat_shop":
      return boatCenter;
    case "boat_service":
      return boatService;
    case "bore-sighting":
      return boreSighting;
    case "bowling":
      return bowling;
    case "conference_room":
      return conferenceRoom;
    case "deli":
      return deli;
    case "dining":
      return dining;
    case "dog_friendly":
      return dogFriendly;
    case "fudge_nuts":
      return fudgeNuts;
    case "gallery":
      return gallery;
    case "gaming":
      return gaming;
    case "general_store":
      return generalStore;
    case "golf":
      return golf;
    case "gun_library":
      return gunLibrary;
    case "gunsmith":
      return gunsmith;
    case "line_spooling":
      return lineSpooling;
    case "mountain_exhibit":
      return mountainExhibit;
    case "musuem": // account for typo id in platform
    case "museum":
      return museum;
    case "off_road_vehicle_servicing":
    case "off_road_service":
      return offRoadVehicleServicing;
    case "off_road_vehicles":
      return offRoadVehicles;
    case "pistol_range":
      return pistolRange;
    case "pre-owned_guns":
      return preOwnedGuns;
    case "rifle_range":
      return rifleRange;
    case "rv_parking":
      return rvParking;
    case "shooting_gallery":
      return shootingGallery;
    default:
      return "no image";
  }
}

function newlineToBr(text: string): string {
  return text.replaceAll("\n", "<br/>");
}

/** formatPhone shouldn't be used outside transformProps (in src/templates)
 * unless absolutely necessary because we don't want to include libPhoneNumber client-side
 *
 * If you are looking to update the format of phones
 * look inside src/templates/index.tsx's transformProps function
 **/
function formatPhone(
  s: string | undefined,
  countryCode: string
): string | undefined {
  if (s) {
    try {
      const phone = parsePhoneNumberWithError(s, countryCode as CountryCode);

      if (countryCode === "US") {
        return phone.formatNational(); // (123) 555-6789
      } else {
        return phone.formatInternational(); // +1 123 555 6789
      }
    } catch (error) {
      if (error instanceof ParseError) {
        // Not a phone number, non-existent country, etc.
        console.error(error.message);
      }
    }
  }

  return s;
}

const groupDirectoryByCountryByRegion = (directoryChildren: any[]) => {
  const locationsByCountry = directoryChildren.reduce(
    (accumulator, currentValue) => {
      const country = getCountryName(currentValue.address.countryCode);
      const region = getRegionName(
        currentValue.address.countryCode,
        currentValue.address.region
      );
      if (accumulator[country]) {
        if (accumulator[country][region]) {
          accumulator[country][region].push(currentValue);
        } else {
          accumulator[country][region] = [currentValue];
        }
      } else {
        accumulator[country] = {};
        accumulator[country][region] = [currentValue];
      }
      return accumulator;
    },
    {}
  );
  return locationsByCountry;
};

function statusTemplateTextOpen(closeTime?: string): string {
  if (!closeTime) {
    return "Open until midnight";
  }
  return `Open today until ${closeTime}`;
}

function statusTemplateTextClosed(
  openTime?: string,
  closeTime?: string
): string {
  if (openTime && closeTime) {
    return `${openTime} - ${closeTime}`;
  }
  return "Closed Today";
}

function isTodayDate(time: Date): boolean {
  const today = new Date();
  return (
    today.getDate() === time.getDate() &&
    today.getMonth() === time.getMonth() &&
    today.getFullYear() === time.getFullYear()
  );
}

function futureTemplateText(
  isOpen: boolean,
  startTime?: Date,
  separator?: string
): string {
  if (!separator) {
    separator = "";
  }
  if (!isOpen) {
    if (startTime) {
      const today = new Date();
      startTime = new Date(startTime);
      if (
        today.getDate() === startTime.getDate() &&
        today.getMonth() === startTime.getMonth() &&
        today.getFullYear() === startTime.getFullYear()
      ) {
        return separator + "Open Today at";
      } else if (startTime.getDate() > today.getDate() + 1) {
        return (
          separator +
          "Open" +
          " " +
          Intl.DateTimeFormat("en-US", { weekday: "long" }).format(startTime) +
          " " +
          "at"
        );
      }
      return separator + "Open tomorrow at";
    }
  } else {
    return separator + "Closes at";
  }
  return "";
}

const getTeaserUrl = (
  relativePrefixToRoot: string,
  brand?: string,
  slug?: string,
  name?: string,
  c_pagesURL?: string,
  c_pagesURLCabelas?: string,
  countryCode?: string,
  websiteUrl?: string
): string => {
  let url = slug ? relativePrefixToRoot + slug : "";
  const isFormerlyCabelaOnBass =
    brand === "Basspro" &&
    (name?.includes("Formerly Cabela's") ||
      name?.includes("Formerly Cabela’s"));
  const isCabelasOnBass =
    brand === "Basspro" &&
    (name?.includes("Cabela's") || name?.includes("Cabela’s"));
  const isBassOnCabela = brand === "Cabelas" && name?.includes("Bass Pro");
  if (countryCode == "CA") {
    url = websiteUrl ?? "";
  } else if (isFormerlyCabelaOnBass || isBassOnCabela) {
    url = c_pagesURL ?? "";
  } else if (isCabelasOnBass) {
    url = c_pagesURLCabelas ?? "";
  }
  return url;
};

export {
  dedupeStreamFields,
  formatPhone,
  groupDirectoryByCountryByRegion,
  getBrand,
  getServiceIcon,
  getCountryName,
  futureTemplateText,
  statusTemplateTextOpen,
  statusTemplateTextClosed,
  isTodayDate,
  newlineToBr,
  getTeaserUrl,
};
