import { ReactNode, useEffect, useRef, useState } from "react";
import {
  HoursStatus,
  HoursTable,
  StatusParams,
} from "@yext/sites-react-components";
import {
  Link,
  Address,
  getDirections,
  Image,
  useAnalytics,
  Day,
  HoursTableDayData,
} from "@yext/pages-components";
import type { Hours, Image as ImageType } from "@yext/types";
import type { LocationProfile, SiteProfile } from "src/types/entities";
import email from "src/assets/images/email.svg";
import { useBreakpoint } from "src/common/useBreakpoints";
import { InstagramSVG } from "src/assets/images/InstagramSVG";
import { FacebookSVG } from "src/assets/images/FacebookSVG";
import { TwitterSVG } from "src/assets/images/TwitterSVG";
import { YoutubeSVG } from "src/assets/images/YoutubeSVG";
import { PinterestSVG } from "src/assets/images/PinterestSVG";
import { useTemplateData } from "src/common/useTemplateData";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import classNames from "classnames";
import {
  formatPhone,
  futureTemplateText,
  getBrand,
  getServiceIcon,
} from "src/common/helpers";
import arrow from "src/assets/images/arrow.svg";
import Markdown from "../common/Markdown";
import { MaybeLink } from "../common/MaybeLink";
import ReviewStars from "./ReviewStars";
import "./HoursStatus.css";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";

const Core = (props: { count?: number; averageRating?: number }) => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  return (
    <ErrorBoundaryWithAnalytics name="core">
      <CoreLayout
        profile={profile}
        count={props.count}
        averageRating={props.averageRating}
      />
    </ErrorBoundaryWithAnalytics>
  );
};

const isHolidayHours = (
  holidayHours: any,
  day: Day,
  todayDate: Date,
  hoursLimitDate: Date
) => {
  return holidayHours.find((hours: any) => {
    const [hoursYear, hoursMonth, hoursDay] = hours.date.split("-");
    const hoursDate = new Date(hoursYear, hoursMonth - 1, hoursDay);
    return (
      hoursDate >= todayDate &&
      hoursDate < hoursLimitDate &&
      luxonDateToDay(DateTime.fromString(hours.date, "yyyy-LL-dd")) === day
    );
  });
};

export function luxonDateToDay(d: DateTime): Day {
  const dayMap: Record<number, Day> = {
    1: Day.Monday,
    2: Day.Tuesday,
    3: Day.Wednesday,
    4: Day.Thursday,
    5: Day.Friday,
    6: Day.Saturday,
    7: Day.Sunday,
  };

  if (d.weekday in dayMap) {
    return dayMap[d.weekday];
  } else {
    throw new Error(`Invalid DateTime.weekday property: ${d}, ${d.weekday}`);
  }
}

type CoreLayoutProps = {
  profile: LocationProfile;
  count?: number;
  averageRating?: number;
};

const CoreHeading = (props: { children: ReactNode }) => {
  return (
    <h2
      className={classNames(
        "text-lg lg:text-xl tracking-[1.5px] text-brand-green-300"
      )}
    >
      {props.children}
    </h2>
  );
};

interface ContactHelperProps {
  image?: ImageType;
  name?: string;
  position?: string;
  emailText?: string;
  email?: string;
}

const ContactHelper = (props: ContactHelperProps) => {
  return (
    <div className="flex flex-row font-secondary">
      {props.image && (
        <div className="w-[15%] h-full shrink-0 mr-4">
          <Image image={props.image} />
        </div>
      )}
      <div className="flex flex-col text-left mr-4 w-[calc(50%-16px)]">
        {props.name && <div className="font-bold text-lg">{props.name}</div>}
        {props.position && (
          <div className="text-sm whitespace-nowrap">{props.position}</div>
        )}
      </div>
      {props.email && props.emailText && (
        <div className="flex">
          <Link
            className={classNames(
              "my-auto Link--underline font-bold text-sm flex flex-row gap-2 text-brand-green-300"
            )}
            href={`mailto:${props.email}`}
            eventName="emailteam"
          >
            <img className="w-4 h-4 my-auto" src={email} alt="email" />
            {props.emailText}
          </Link>
        </div>
      )}
    </div>
  );
};

const CoreLayout = (props: CoreLayoutProps) => {
  const [pickUp, setPickUp] = useState(false);
  const isDesktopBreakpoint = useBreakpoint("lg");
  const { profile } = props;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const hoursLimitDate = new Date();
  hoursLimitDate.setHours(0, 0, 0, 0);
  hoursLimitDate.setDate(hoursLimitDate.getDate() + 7);
  const socialIconClassNames = classNames("text-brand-green-300");
  const socialLinks = [
    {
      link: profile.facebookPageUrl ?? profile._site.c_facebook,
      label: <FacebookSVG className={socialIconClassNames} />,
      name: "facebook",
    },
    {
      link: profile._site.c_twitter,
      label: <TwitterSVG className={socialIconClassNames} />,
      name: "twitter",
    },
    {
      link: profile._site.c_pinterest,
      label: <PinterestSVG className={socialIconClassNames} />,
      name: "pinterest",
    },
    {
      link: profile._site.c_youtube,
      label: <YoutubeSVG className={socialIconClassNames} />,
      name: "youtube",
    },
    {
      link: profile._site.c_instagram,
      label: <InstagramSVG className={socialIconClassNames} />,
      name: "instagram",
    },
  ].filter((link) => link.link);

  // Filter to currently active flyer events
  const timeNow = new Date();
  const filteredEvents = profile.c_linkedEventEntity
    ? profile.c_linkedEventEntity.filter((event) => {
        if (event.c_eventType !== "SYNDECA") {
          return false;
        }
        if (event.time?.start && event.time.end) {
          const eventStartTime = new Date(event.time.start);
          const eventEndTime = new Date(event.time.end);
          return timeNow < eventEndTime && timeNow >= eventStartTime;
        }
        return false;
      })
    : null;

  if (filteredEvents) {
    // Sort events by the earliest upcoming date
    filteredEvents.sort((a, b) => {
      const dateA = a.time?.start ? new Date(a.time.start) : new Date();
      const dateB = b.time?.start ? new Date(b.time.start) : new Date();

      return dateA.getTime() - dateB.getTime(); // Sort ascending
    });
  }

  const sundayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Sunday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const mondayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Monday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const tuesdayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Tuesday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const wednesdayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Wednesday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const thursdayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Thursday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const fridayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Friday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const saturdayHoursIsHoliday = profile.hours?.holidayHours
    ? isHolidayHours(
        profile.hours.holidayHours,
        Day.Saturday,
        todayDate,
        hoursLimitDate
      )
    : false;

  const holidayMap: Record<string, boolean> = {
    MONDAY: mondayHoursIsHoliday,
    TUESDAY: tuesdayHoursIsHoliday,
    WEDNESDAY: wednesdayHoursIsHoliday,
    THURSDAY: thursdayHoursIsHoliday,
    FRIDAY: fridayHoursIsHoliday,
    SATURDAY: saturdayHoursIsHoliday,
    SUNDAY: sundayHoursIsHoliday,
  };

  const showAdditionalHoursText =
    sundayHoursIsHoliday ||
    mondayHoursIsHoliday ||
    tuesdayHoursIsHoliday ||
    wednesdayHoursIsHoliday ||
    thursdayHoursIsHoliday ||
    fridayHoursIsHoliday ||
    saturdayHoursIsHoliday;

  const [loadEvents, setLoadEvents] = useState(false);

  useEffect(() => {
    setLoadEvents(true);
  }, []);

  return (
    <div className="Core pb-10">
      {profile.c_heroImage1 && (
        <Image className="" image={profile.c_heroImage1} />
      )}
      <div
        className={classNames(
          "legacy-container flex flex-col pt-8 md:border md:p-8 divide-y divide-brand-gray-300",
          {
            "-mt-24 bg-white z-10 relative":
              profile.c_heroImage1 && isDesktopBreakpoint,
          }
        )}
      >
        <div className="flex flex-col pb-8">
          <h1 className="flex flex-col sm:gap-4">
            <span className="Heading Heading--sub text-brand-gray-600 pb-1 sm:pb-0">
              {profile.name}
            </span>
            <span
              className={classNames(
                "Heading Heading--lead text-brand-green-300"
              )}
            >
              {profile.c_geomodifier ??
                `${profile.address.city}, ${profile.address.region}`}
            </span>
          </h1>
          {profile.hours && (
            <div className="mt-4 font-secondary">
              <HoursStatus
                className="text-lg"
                hours={profile.hours}
                separatorTemplate={() => <span className="bullet" />}
                dayOfWeekTemplate={() => null}
                timezone={profile.timezone}
                futureTemplate={(params: StatusParams) => {
                  return futureTemplateText(
                    params.isOpen,
                    params.futureInterval?.start,
                    " "
                  );
                }}
                currentTemplate={(params: StatusParams) => {
                  if (!params.futureInterval) {
                    return (
                      <span className="HoursStatus-current HoursStatus-current--closed">
                        Temporarily Closed
                      </span>
                    );
                  }
                  return (
                    <span
                      className={`HoursStatus-current HoursStatus-current--${
                        params.isOpen ? "open" : "closed"
                      } font-bold`}
                    >
                      {params.isOpen ? "Open Now" : "Closed"}
                    </span>
                  );
                }}
              />
            </div>
          )}
          {props.averageRating && (
            <div className="pt-2 font-secondary flex flex-wrap">
              <div className="">
                {props.averageRating.toFixed(1)} out of 5.0
              </div>
              <div className="my-auto">
                <ReviewStars rating={props.averageRating} className="mx-3" />
              </div>
              <Link
                className="Link Link--underline w-full sm:w-auto"
                href="#Reviews"
                eventName="GoogleReviews"
              >
                ({props.count} Google Reviews)
              </Link>
            </div>
          )}
        </div>
        {profile.c_pickupLabel && profile.c_curbside_pickup && (
          <div className="border-y border-brand-gray-300 hidden lg:block">
            <button
              className="w-full flex justify-between px-[15px] md:px-0 py-8"
              onClick={() => setPickUp(!pickUp)}
            >
              <span
                className={classNames(
                  "text-lg lg:text-xl tracking-[1.5px] text-brand-green-300"
                )}
              >
                {profile.c_pickupLabel}
              </span>
              <span
                className={classNames("my-auto transition-all duration-250", {
                  "rotate-180": pickUp,
                })}
              >
                <img src={arrow} alt="" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {pickUp && (
                <motion.div
                  className={classNames("font-secondary pb-8")}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Markdown>{profile.c_curbside_pickup}</Markdown>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="flex flex-col lg:divide-y divide-brand-gray-300">
          <div className="flex flex-col lg:flex-row mt-8 gap-8">
            <div className="lg:w-1/3 flex flex-col divide-y divide-brand-gray-300">
              <div className="flex flex-col gap-4 font-secondary pb-8">
                <Address
                  className="text-base"
                  address={profile.address}
                  lines={[
                    ["line1", "line2"],
                    ["city", ",", "region", "postalCode"],
                  ]}
                />
                {profile.mainPhone && (
                  <Link
                    className="text-brand-gray-600 Link--underline flex font-bold"
                    href={`tel:${profile.mainPhone}`}
                    eventName="phonecall"
                  >
                    {formatPhone(profile.mainPhone, "US")}
                  </Link>
                )}
                <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
                  <Link
                    className={classNames(
                      "whitespace-nowrap",
                      { "Button Button--primary": getBrand() == "Basspro" },
                      {
                        "Button Button--primaryCabelas":
                          getBrand() != "Basspro",
                      }
                    )}
                    href={`${getDirections(
                      profile.address,
                      profile.ref_listings,
                      profile.googlePlaceId
                    )}`}
                    eventName="getdirections"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Get Directions
                  </Link>
                  {profile.c_shopNowButtonText && profile.c_shopNowButtonURL && (
                    <Link
                      className={classNames(
                        "whitespace-nowrap",
                        { "Button Button--secondary": getBrand() == "Basspro" },
                        {
                          "Button Button--secondaryCabelas":
                            getBrand() != "Basspro",
                        }
                      )}
                      href={profile.c_shopNowButtonURL}
                    >
                      {profile.c_shopNowButtonText}
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 py-8">
                <CoreHeading>
                  {profile.c_teamLabel ?? "Contact The Team"}
                </CoreHeading>
                {profile.c_storeManager && (
                  <ContactHelper
                    image={profile._site.c_header?.logo}
                    name={profile.c_storeManager}
                    position={profile.c_storeManagerTitle1}
                    emailText={profile.c_storeManagerEmailText1}
                    email={profile.emails && profile.emails[0]}
                  />
                )}
                {profile.c_tmbcManager && (
                  <ContactHelper
                    image={profile.c_trackerBoatLogo}
                    name={profile.c_tmbcManager}
                    position={profile.c_storeManagerTitle2}
                    emailText={profile.c_storeManagerEmailText2}
                    email={profile.c_tmbcEmail}
                  />
                )}
                {profile.c_restaurantManager && (
                  <ContactHelper
                    image={
                      profile.c_restaurantLogos && profile.c_restaurantLogos[0]
                    }
                    name={profile.c_restaurantManager}
                    position={profile.c_storeManagerTitle3}
                    emailText={profile.c_storeManagerEmailText3}
                    email={profile.c_restaurantEmail}
                  />
                )}
              </div>
            </div>
            <div className="lg:w-1/3 flex flex-col lg:divide-y pt-8 pb-4 divide-brand-gray-300 border-t border-gray-300 md:border-none lg:pt-0">
              {(profile.hours ||
                profile.additionalHoursText ||
                profile.c_additionalHoursUnderRegularHours) && (
                <div className="pb-8 border-b border-gray-300 md:border-none">
                  <CoreHeading>{profile.c_hoursLabel ?? "Hours"}</CoreHeading>
                  {profile.hours && (
                    <HoursTable
                      className="font-secondary mt-4"
                      hours={profile.hours}
                      startOfWeek="Today"
                      intervalStringsBuilderFn={(
                        h: HoursTableDayData,
                        t?: Intl.DateTimeFormatOptions
                      ) => {
                        const intervalStrings: string[] = [];
                        if (h.intervals.length === 0) {
                          const closedText = holidayMap[h.startDay]
                            ? "Closed*"
                            : "Closed";
                          intervalStrings.push(closedText);
                        } else {
                          h.intervals.forEach((interval) => {
                            const startTime = interval.getStartTime("en-US", t);
                            const endTime = interval.getEndTime("en-US", t);
                            const intervalString = holidayMap[h.startDay]
                              ? `${startTime} - ${endTime}*`
                              : `${startTime} - ${endTime}`;
                            intervalStrings.push(intervalString);
                          });
                        }
                        return intervalStrings;
                      }}
                    />
                  )}
                  {profile.additionalHoursText && showAdditionalHoursText && (
                    <div className="font-secondary">
                      {profile.additionalHoursText}
                    </div>
                  )}
                  {profile.c_additionalHoursUnderRegularHours && (
                    <div className="font-secondary pt-2 italic">
                      {profile.c_additionalHoursUnderRegularHours}
                    </div>
                  )}
                </div>
              )}
              <div className="pt-8 flex flex-col gap-4">
                <CoreHeading>
                  {profile.c_connectWithUsLabel ?? "Connect With Us"}
                </CoreHeading>
                {profile.c_formURL && profile.c_signUpLinkText && (
                  <Link
                    className={classNames(
                      "my-auto Link--underline font-bold flex gap-2 font-secondary text-sm text-brand-green-300"
                    )}
                    href={profile.c_formURL}
                  >
                    <img className="w-4 h-4 my-auto" src={email} alt="email" />
                    {profile.c_signUpLinkText}
                  </Link>
                )}
                {socialLinks && (
                  <div className="flex gap-8 mb-4">
                    {socialLinks.map((socialLink, i) =>
                      socialLink.link ? (
                        <Link
                          key={i}
                          href={socialLink.link}
                          eventName={socialLink.name}
                          target="_blank"
                        >
                          <span className="sr-only">
                            Visit us on{" "}
                            {socialLink.name.charAt(0).toUpperCase() +
                              socialLink.name.slice(1)}
                          </span>
                          {socialLink.label}
                        </Link>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/3 hidden lg:block">
              <CoreHeading>
                {profile.c_salesLabel ?? "View Current Sales"}
              </CoreHeading>
              {loadEvents && filteredEvents && (
                <div className="Hero-salesList flex flex-col pt-[16px] font-secondary">
                  {filteredEvents.slice(0, 6).map((event) => (
                    <>
                      {event.photoGallery && event.name && event.websiteUrl && (
                        <div className="Hero-salesItem js-circular flex mb-[16px]">
                          {event.photoGallery.length > 0 && (
                            <div className="Hero-salesImageWrapper w-[60px]">
                              <div className="h-full w-full">
                                <Image image={event.photoGallery[0]} />
                              </div>
                            </div>
                          )}
                          <div className="Hero-salesContent ml-[16px]">
                            <div className="Hero-salesDescription text-[18px]">
                              {event.name}
                            </div>
                            {event.websiteUrl?.url && (
                              <div className="Hero-salesLinkWrapper">
                                <a
                                  className="Hero-salesLink text-[16px] font-bold underline hover:no-underline text-brand-green-300"
                                  href={event.websiteUrl.url}
                                >
                                  View Now
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {((profile.c_pickupLabel && profile.c_curbside_pickup) ||
              (profile.hours && profile.c_boatSalesHoursHeading) ||
              (profile.c_boatAndATVServiceHours &&
                profile.c_boatAndATVServiceHeading) ||
              profile.c_additionalHoursADMIN) && (
              <div className="lg:w-1/3 flex flex-col lg:divide-y">
                {profile.c_pickupLabel && profile.c_curbside_pickup && (
                  <div className="border-y border-brand-gray-300 lg:hidden">
                    <button
                      className="w-full flex justify-between px-[15px] lg:px-0 py-8"
                      onClick={() => setPickUp(!pickUp)}
                    >
                      <span
                        className={classNames(
                          "text-lg lg:text-xl tracking-[1.5px] text-brand-green-300"
                        )}
                      >
                        {profile.c_pickupLabel}
                      </span>
                      <span
                        className={classNames("my-auto", {
                          "rotate-180": pickUp,
                        })}
                      >
                        <img src={arrow} alt="" />
                      </span>
                    </button>
                    {pickUp && (
                      <div
                        className={classNames("font-secondary pb-8 px-[16px]")}
                      >
                        <Markdown>{profile.c_curbside_pickup}</Markdown>
                      </div>
                    )}
                  </div>
                )}
                {profile.hours && profile.c_boatSalesHoursHeading && (
                  <>
                    {hoursHelper(
                      profile.hours,
                      profile.c_boatSalesHoursHeading,
                      1,
                      profile.timezone
                    )}
                  </>
                )}
                {profile.c_boatAndATVServiceHours &&
                  profile.c_boatAndATVServiceHeading && (
                    <div className="">
                      {hoursHelper(
                        profile.c_boatAndATVServiceHours,
                        profile.c_boatAndATVServiceHeading,
                        2,
                        profile.timezone
                      )}
                    </div>
                  )}
                {profile.c_additionalHoursADMIN && (
                  <div className="flex flex-col py-8 border-b lg:border-none border-brand-gray-300">
                    {profile.c_additionalHoursLabel3 && (
                      <span className="pb-4">
                        <CoreHeading>
                          {profile.c_additionalHoursLabel3}
                        </CoreHeading>
                      </span>
                    )}
                    <div className="font-secondary">
                      {profile.c_additionalHoursADMIN}
                    </div>
                  </div>
                )}
              </div>
            )}
            {loadEvents && filteredEvents && (
              <div className="lg:w-1/3 block lg:hidden border-b border-brand-gray-300 pt-8 pb-4">
                <CoreHeading>
                  {profile.c_salesLabel ?? "View Current Sales"}
                </CoreHeading>
                <div className="Hero-salesList flex flex-col pt-[16px] font-secondary">
                  {filteredEvents.map((event) => (
                    <>
                      {event.photoGallery && event.name && event.websiteUrl && (
                        <div className="Hero-salesItem js-circular flex mb-[16px]">
                          {event.photoGallery.length > 0 && (
                            <div className="Hero-salesImageWrapper w-[60px]">
                              <div className="h-full w-full">
                                <Image image={event.photoGallery[0]} />
                              </div>
                            </div>
                          )}
                          <div className="Hero-salesContent ml-[16px] flex flex-col">
                            <div className="Hero-salesDescription text-[18px]">
                              {event.name}
                            </div>
                            {event.websiteUrl?.url && (
                              <div className="Hero-salesLinkWrapper">
                                <a
                                  className="Hero-salesLink text-[16px] font-bold underline hover:no-underline text-brand-green-300"
                                  href={event.websiteUrl.url}
                                >
                                  View Now
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            )}
            {profile.c_storeServiceList1 &&
              profile.c_storeServiceList1.length > 0 && (
                <div className="lg:w-1/3 flex flex-col gap-4 py-8 border-b lg:border-none border-brand-gray-300">
                  <CoreHeading>
                    {profile.c_thisStoreLabel ?? "At This Store"}
                  </CoreHeading>
                  {profile.c_storeServiceList1.map((service, i) => (
                    <div className="flex gap-4">
                      <Image
                        className="!w-[150px] !object-contain"
                        image={service.image}
                      />
                      <MaybeLink
                        href={service.clickthroughUrl}
                        className={classNames(
                          "Link--underline text-lg font-secondary font-bold my-auto text-brand-green-300"
                        )}
                        eventName={`service-link${i + 1}`}
                      >
                        {service.description}
                      </MaybeLink>
                    </div>
                  ))}
                </div>
              )}
            {profile.c_servicesThisStore &&
              profile.c_servicesThisStore.length > 0 && (
                <div className="lg:w-1/3 flex flex-col gap-4 border-b border-brand-gray-300 lg:border-none py-8">
                  <CoreHeading>
                    {profile.c_serviceLabel ?? "Services"}
                  </CoreHeading>
                  <div className="flex flex-wrap">
                    {profile.c_servicesThisStore.map((service) => (
                      <>{serviceIconHelper(service.toLowerCase())}</>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

const hoursHelper = (
  hours: Hours,
  title: string,
  index: number,
  timezone: string
) => {
  const [isOpen, setIsOpen] = useState(false);
  const analytics = useAnalytics();
  const tableRef = useRef<HTMLDivElement>(null);
  const toggleTable = () => {
    if (tableRef.current != null) {
      if (!isOpen) {
        const ansHeight = tableRef.current.scrollHeight;
        tableRef.current.style.height = `${ansHeight}px`;
      } else {
        tableRef.current.style.height = `0`;
      }
    }
    analytics?.track(`toggle${index}`);
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col py-8 border-b lg:border-none border-brand-gray-300">
      <span className="pb-4">
        <CoreHeading>{title}</CoreHeading>
      </span>
      <button
        className="flex gap-3"
        onClick={() => {
          toggleTable();
          analytics?.track(`hours-toggle${index}`);
        }}
      >
        <HoursStatus
          className="font-secondary"
          hours={hours}
          timezone={timezone}
          separatorTemplate={() => <span className="bullet" />}
          dayOfWeekTemplate={() => null}
          futureTemplate={(params: StatusParams) => {
            return futureTemplateText(
              params.isOpen,
              params.futureInterval?.start,
              " "
            );
          }}
        />
        <span
          className={classNames("my-auto ml-auto lg:ml-0 duration-500", {
            "rotate-180": isOpen,
          })}
        >
          <img src={arrow} alt="" />
        </span>
      </button>
      <div
        ref={tableRef}
        className={classNames(
          "overflow-hidden duration-500 h-0 transition-all pt-4",
          { invisible: !isOpen }
        )}
      >
        <HoursTable
          className="font-secondary"
          hours={hours}
          startOfWeek="Today"
        />
      </div>
    </div>
  );
};

const serviceIconHelper = (service: string) => {
  const src = getServiceIcon(service);
  const serviceName = service.replaceAll("_", " ");

  return (
    <div
      key={service}
      className={classNames(
        "font-secondary flex flex-col gap-2 max-w-[25%] basis-1/4 justify-start items-center grow-0 shrink-0 pb-4",
        { "justify-end": src === "no image" }
      )}
    >
      {src != "no image" && (
        <div className="w-[65px] h-[65px]">
          <img src={src} alt={serviceName} />
        </div>
      )}
      <div className="text-xs text-brand-gray-600 font-bold text-center">
        {serviceName.toUpperCase()}
      </div>
    </div>
  );
};

export default Core;
