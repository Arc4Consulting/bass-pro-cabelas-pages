import ErrorBoundaryWithAnalytics from "src/components/common/ErrorBoundaryWithAnalytics";
import { useTemplateData } from "src/common/useTemplateData";

const Footer = () => {
  const templateData = useTemplateData();
  const siteProfile = templateData.document._site;

  return (
    <ErrorBoundaryWithAnalytics name="footer">
      <FooterLayout copyrightMessage={siteProfile.c_copyrightMessage || ""} />
    </ErrorBoundaryWithAnalytics>
  );
};

interface FooterLayoutProps {
  copyrightMessage: string;
}

const FooterLayout = (props: FooterLayoutProps) => {
  const copyrightMessage = props.copyrightMessage;

  return (
    <footer className="Footer bg-brand-gray-700 py-8 font-secondary">
      <div className="legacy-container">
        <div className="text-sm text-center text-white">{copyrightMessage}</div>
      </div>
    </footer>
  );
};

export { Footer };
