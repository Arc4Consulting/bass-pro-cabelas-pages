import { useState, useRef } from "react";
import c from "classnames";
import classNames from "classnames";
import { getBrand } from "src/common/helpers";
import Markdown from "../common/Markdown";
import { useAnalytics } from "@yext/pages-components";

interface FAQItem {
  question: string;
  answer: string;
  index: number;
}

const FAQ = (props: FAQItem) => {
  const { question, answer, index } = props;
  const [isOpen, setIsOpen] = useState(false);
  const faqRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

  const faqToggle = () => {
    if (faqRef.current != null) {
      if (!isOpen) {
        const ansHeight = faqRef.current.scrollHeight;
        faqRef.current.style.height = `${ansHeight}px`;
      } else {
        faqRef.current.style.height = `0`;
      }
    }
    analytics?.track(`toggle${index}`);
    setIsOpen(!isOpen);
  };

  const arrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
    >
      <path
        d="M13.8898 3.34367L13.667 3.12087C13.5195 2.97338 13.281 2.97338 13.1335 3.12087L7.00176 9.25575L0.866885 3.12087C0.719397 2.97338 0.480905 2.97338 0.333417 3.12087L0.110616 3.34367C-0.036872 3.49116 -0.036872 3.72965 0.110616 3.87714L6.73189 10.5016C6.87938 10.649 7.11787 10.649 7.26536 10.5016L13.8866 3.87714C14.0373 3.72965 14.0373 3.49116 13.8898 3.34367Z"
        fill="#1E1D19"
      />
    </svg>
  );

  return (
    <div>
      <button
        className={classNames(
          "justify-between w-full flex p-4 lg:px-0 cursor-pointer text-lg tracking-[1.5px] text-left text-brand-green-300"
        )}
        onClick={faqToggle}
      >
        <div>{question}</div>
        <div className="flex my-auto">
          <div
            className={c(
              "transition-transform duration-500 text-brand-primary w-[14px]",
              { "rotate-180": isOpen }
            )}
          >
            {arrow}
          </div>
        </div>
      </button>
      <div
        ref={faqRef}
        className={classNames(
          "overflow-hidden duration-500 h-0 transition-all",
          { invisible: !isOpen }
        )}
      >
        <div className="pb-4 px-4 lg:px-0 font-secondary text-brand-gray-600">
          <Markdown>{answer}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
