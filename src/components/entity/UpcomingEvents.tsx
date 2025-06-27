import { EventsProfile, LocationProfile } from "src/types/entities";
import { useTemplateData } from "src/common/useTemplateData";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import { useEffect, useRef, useState } from "react";
import UpcomingEventCard from "../cards/UpcomingEventCard";

const UpcomingEvents = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;
  const events = profile.c_linkedEventEntity;
  const [loadEvents, setLoadEvents] = useState(false);
  useEffect(() => {
    setLoadEvents(true);
  }, []);

  const title = "Upcoming Events At " + profile.address.city;
  const filteredEvents = events?.filter((item) => {
    if (item.c_eventType == "SYNDECA") {
      // Filter out SYNDECA Events
      return false;
    }
    const startDate = item.time?.start ? new Date(item.time.start) : null;
    const endDate = item.time?.end ? new Date(item.time.end) : null;
    const now = new Date();

    if (startDate && startDate >= now) {
      // If startDate is in the future
      return true;
    }

    if (startDate && startDate <= now) {
      // If event has already started
      // Include if not past end date
      return now <= endDate;
    }
    return false;
  });

  if (filteredEvents && filteredEvents.length > 0) {
    // Sort events by the earliest upcoming date
    filteredEvents.sort((a, b) => {
      const dateA = a.time?.start ? new Date(a.time.start) : null;
      const dateB = b.time?.start ? new Date(b.time.start) : null;

      // Handle cases where the date is invalid
      const timeA =
        dateA && !isNaN(dateA.getTime()) ? dateA.getTime() : Infinity;
      const timeB =
        dateB && !isNaN(dateB.getTime()) ? dateB.getTime() : Infinity;

      return timeA - timeB; // Sort ascending
    });

    return (
      <ErrorBoundaryWithAnalytics name="upcomingEvents">
        {loadEvents && filteredEvents && (
          <UpcomingEventsLayout
            title={title}
            items={filteredEvents}
            initialSize={4}
            moreEventsCount={filteredEvents.length - 4}
          />
        )}
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type UpcomingEventsLayoutProps = {
  title: string;
  items: EventsProfile[];
  initialSize?: number;
  moreEventsCount: number;
};

const UpcomingEventsLayout = (props: UpcomingEventsLayoutProps) => {
  const { title, items, initialSize, moreEventsCount } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const collapsibleRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string | number>("0");
  useEffect(() => {
    if (collapsibleRef.current) {
      setHeight(isExpanded ? collapsibleRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div className="legacy-container pb-8 sm:pb-16">
      <h2 className="Heading Heading--head pb-4 lg:pb-8 text-center  text-brand-green-300">
        {title}
      </h2>
      <ul className="flex flex-col">
        {items.slice(0, initialSize).map((member, i) => (
          <li className="flex flex-col" key={i}>
            <UpcomingEventCard
              time={member.time}
              name={member.name}
              description={member.description}
              websiteUrl={member.websiteUrl?.url}
            />
          </li>
        ))}
      </ul>
      {moreEventsCount > 0 && (
        <div
          ref={collapsibleRef}
          className="overflow-hidden transition-height duration-300 ease-in-out"
          style={{ height: height }}
        >
          <ul className="flex flex-col">
            {items.slice(initialSize, items.length).map((member, i) => (
              <li className="flex flex-col" key={i}>
                <UpcomingEventCard
                  time={member.time}
                  name={member.name}
                  description={member.description}
                  websiteUrl={member.websiteUrl?.url}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {moreEventsCount > 0 &&
        (isExpanded ? (
          <button
            className="Link whitespace-nowrap Button Button--secondary mx-auto"
            onClick={() => {
              toggleExpand();
            }}
          >
            {`- Show ${moreEventsCount} Less Events`}
          </button>
        ) : (
          <button
            className="Link whitespace-nowrap Button Button--secondary mx-auto mt-[16px]"
            onClick={() => {
              toggleExpand();
            }}
          >
            {`+ Show ${moreEventsCount} More Events`}
          </button>
        ))}
    </div>
  );
};

export default UpcomingEvents;
