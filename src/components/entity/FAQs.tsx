import type { FAQProfile, LocationProfile } from "src/types/entities";
import FAQ from "src/components/entity/FAQ";
import { useTemplateData } from "src/common/useTemplateData";
import ErrorBoundaryWithAnalytics from "../common/ErrorBoundaryWithAnalytics";
import classNames from "classnames";
import { getBrand } from "src/common/helpers";

const FAQs = () => {
  const templateData = useTemplateData();
  const profile = templateData.document as LocationProfile;

  const faq = [
    { question: profile.c_question1, answer: profile.c_answer1 },
    { question: profile.c_question2, answer: profile.c_answer2 },
    { question: profile.c_question3, answer: profile.c_answer3 },
    { question: profile.c_question4, answer: profile.c_answer4 },
    { question: profile.c_question5, answer: profile.c_answer5 },
    { question: profile.c_question6, answer: profile.c_answer6 },
  ].filter((link) => link.question && link.answer);

  if (faq && faq.length > 0) {
    return (
      <ErrorBoundaryWithAnalytics name="faq">
        <FAQsLayout
          title={profile.c_fAQTitle ?? "Frequently Asked Questions"}
          faqs={faq}
        />
      </ErrorBoundaryWithAnalytics>
    );
  }

  return null;
};

type FAQsLayoutProps = {
  title: string;
  faqs: {
    question?: string;
    answer?: string;
  }[];
};

const FAQsLayout = (props: FAQsLayoutProps) => {
  const { title, faqs } = props;

  return (
    <div className="FAQ py-8">
      <div className="legacy-container">
        <h2
          className={classNames(
            "Heading Heading--head pb-4 lg:pb-8 text-center text-brand-green-300"
          )}
        >
          {title}
        </h2>
        <div className="divide-y divide-brand-gray-300 border-t border-b border-brand-gray-300">
          {faqs.map((faq, i) => (
            <>
              {faq.question && faq.answer && (
                <FAQ
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  index={i + 1}
                />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
