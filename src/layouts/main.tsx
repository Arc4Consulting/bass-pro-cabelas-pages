import type { ReactNode } from "react";
import type { TemplateRenderProps, BaseProfile } from "src/types/entities";
import { AnalyticsProvider } from "@yext/pages-components";
import { ConfigurationProvider } from "@yext/sites-react-components";
import { TemplateDataProvider } from "src/common/useTemplateData";
import { Header } from "src/components/common/Header";
import { Footer } from "src/components/common/Footer";
import { useExposeEnableYAFunction } from "src/common/useExposeEnableYAFunction";
import config, { ANALYTICS_API_KEY } from "src/config";
import { initi18n } from "src/i18n";
import "@yext/pages-components/style.css";

interface MainProps {
  data: TemplateRenderProps<BaseProfile>;
  children?: ReactNode;
  hideFooter?: boolean;
}

const Main = (props: MainProps) => {
  initi18n(props.data.translations || {}, props.data.document.locale);

  return (
    <ConfigurationProvider value={config}>
      <AnalyticsProvider
        templateData={props.data}
        requireOptIn={false}
        productionDomains={["stores.basspro.com", "stores.cabelas.com"]}
        apiKey={ANALYTICS_API_KEY}
        currency="USD"
      >
        <MainInternal {...props} />
      </AnalyticsProvider>
    </ConfigurationProvider>
  );
};

const MainInternal = (props: MainProps) => {
  const { _site } = props.data.document;

  const { children, hideFooter } = props;

  // Create the global window.enableYextAnalytics function for clients that need to get user consent
  // If consent is not required, set requireOptIn on AnalyticsProvider above to false.
  useExposeEnableYAFunction();

  return (
    <TemplateDataProvider value={props.data}>
      <Header />
      {children}
      {!hideFooter && <Footer />}
    </TemplateDataProvider>
  );
};

export { Main };
