import { newlineToBr } from "src/common/helpers";
import Markdown from "../common/Markdown";
import { useEffect, useState } from "react";

type UpcomingEventCardProps = {
  time?: {
    start?: string;
    end?: string;
  };
  name?: string;
  description?: string;
  websiteUrl?: string;
};

const TextWithShowMore: React.FC<{ text?: string; limit: number }> = ({
  text,
  limit,
}) => {
  const words = text?.split(" ");
  const [innerText, setInnerText] = useState(newlineToBr(text ?? ""));
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded) {
      setInnerText(newlineToBr(text ?? ""));
    } else {
      const initialText =
        words?.slice(0, limit).join(" ") +
        (words && words?.length > limit ? "..." : "");
      setInnerText(newlineToBr(initialText ?? ""));
    }
  }, [isExpanded, limit, text, words]);

  return (
    <div>
      {innerText && <p dangerouslySetInnerHTML={{ __html: innerText }}></p>}
      {words && words?.length > limit && (
        <button
          onClick={toggleExpand}
          className="text-[14px] font-[700] text-brand-green-300"
        >
          {isExpanded ? "- Read Less" : "+ Read More"}
        </button>
      )}
    </div>
  );
};

const UpcomingEventCard = (props: UpcomingEventCardProps) => {
  const { time, name, description, websiteUrl } = props;
  const date = time?.start ? new Date(time.start) : null;
  const endDate = time?.end ? new Date(time.end) : null;

  const optionsDate: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const formattedStartDate = date
    ? new Intl.DateTimeFormat("en-US", optionsDate).format(date)
    : null;

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedStartTime = date
    ? new Intl.DateTimeFormat("en-US", optionsTime).format(date)
    : null;
  let formattedEndTime;
  if (time?.end) {
    const enddate = new Date(time.end);
    formattedEndTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      enddate
    );
  }
  const [month, day] = formattedStartDate?.split(" ") || [];
  const formattedEndDate = endDate
    ? new Intl.DateTimeFormat("en-US", optionsDate).format(endDate)
    : null;
  const [endMonth, endDay] = formattedEndDate?.split(" ") || [];
  const end =
    endMonth && endMonth != month
      ? endMonth + " " + endDay
      : endDay && endDay != day
      ? endDay
      : null;
  let dateDetails = month && day ? month + " " + day : "";
  if (end) {
    dateDetails = dateDetails + " - " + end;
  }
  let singleDay = endMonth == month && endDay == day;
  return (
    <div className="flex flex-col justify-between border-[1px] border-brand-gray-300 rounded-[4px] mb-[16px]">
      <div className="top-content bg-brand-nearby rounded-[4px]">
        {name && (
          <h3 className="text-[24px] text-brand-green-300 text-left pt-4 px-4 pb-3">
            {name}
          </h3>
        )}
      </div>
      <div className="bottom-content flex px-[16px] pb-[16px] pt-[24px] flex-col md:flex-row">
        <div className="dateTime flex md:flex-col justify-center px-[16px] py-[8px] md:p-[16px] md:ml-4 mr-6 w-max md:w-[185px] md:h-[169px] border-[1px] rounded-[4px] border-brand-nearby mb-4 md:mb-0">
          {dateDetails && (
            <div className="date text-brand-green-300 md:pb-[8px] text-[24px] md:text-[48px] text-center uppercase whitespace-pre-line leading-none flex md:flex-col">
              <div>{dateDetails}</div>
            </div>
          )}
          {!end && <div className="md:hidden px-[16px]">|</div>}
          {singleDay && formattedStartTime && (
            <div className="time text-[12px] text-brand-green text-center uppercase font-secondary self-center">
              {formattedStartTime}
              {formattedEndTime && " - " + formattedEndTime}
            </div>
          )}
        </div>
        <div className="flex w-full">
          {description && (
            <div className="description  font-secondary w-[80%] md:w-[55%]">
              <TextWithShowMore text={description} limit={27} />
            </div>
          )}
          {websiteUrl && (
            <div className="websiteUrl flex justify-end mt-auto text-[14px] text-brand-green-300 font-[700] font-secondary ml-auto w-[20%]">
              <a href={websiteUrl}>More Info</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
