import {
  HoursStatus as YextHoursStatus,
  HoursStatusProps,
  StatusParams,
} from "@yext/sites-react-components";

function isIndefinitelyClosed(params: StatusParams): boolean {
  return !params.futureInterval;
}

function defaultCurrentTemplate(params: StatusParams): React.ReactNode {
  if (isIndefinitelyClosed(params)) {
    return (
      <span className="HoursStatus-current HoursStatus-current--closed">
        Closed Today
      </span>
    );
  }
  return (
    <span
      className={`HoursStatus-current HoursStatus-current--${
        params.isOpen ? "open" : "closed"
      } font-bold`}
    >
      {params.isOpen
        ? `Open today until ${params.currentInterval?.getEndTime(
            "en-US",
            params.timeOptions
          )}`
        : "Closed today"}
    </span>
  );
}

const HoursStatus = (props: HoursStatusProps) => {
  return (
    <YextHoursStatus
      separatorTemplate={() => " "}
      currentTemplate={(s: StatusParams) => defaultCurrentTemplate(s)}
      futureTemplate={() => null}
      timeTemplate={() => null}
      dayOfWeekTemplate={() => null}
      {...props}
    />
  );
};

export default HoursStatus;
