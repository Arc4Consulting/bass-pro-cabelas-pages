import type { CTA, Image as ImageType } from "@yext/types";
import { Image, Link } from "@yext/pages-components";
import c from "classnames";
import { Dispatch, SetStateAction, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MaybeLink } from "src/components/common/MaybeLink";
import ErrorBoundaryWithAnalytics from "src/components/common/ErrorBoundaryWithAnalytics";
import { useTemplateData } from "src/common/useTemplateData";
import classNames from "classnames";
import menuClose from "src/assets/images/menuClose.svg";
import menuicon from "src/assets/images/menuicon.svg";
import { useCustomAnimation } from "src/components/common/useCustomAnimation";

const Header = () => {
  const templateData = useTemplateData();
  const siteProfile = templateData.document._site;
  const brand = siteProfile.c_brand;

  return (
    <ErrorBoundaryWithAnalytics name="header">
      <HeaderLayout
        links={siteProfile.c_header?.links || []}
        logo={siteProfile.c_header?.logo}
        logoLink={siteProfile.c_logoURL}
        isBasspro={brand == "Basspro" ? true : false}
      />
    </ErrorBoundaryWithAnalytics>
  );
};

type HeaderLayoutProps = {
  links: CTA[];
  logo?: ImageType;
  logoLink?: string;
  isBasspro: boolean;
};

const HeaderLayout = (props: HeaderLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logo, logoLink, links, isBasspro } = props;

  return (
    <header className="Header relative">
      <div className="py-3 px-[18px] md:px-[15px] flex justify-start">
        <button
          className="flex md:hidden mr-4 my-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <img src={menuClose} alt="menu open" />
          ) : (
            <img src={menuicon} alt="menu open" />
          )}
          <span className="sr-only">Toggle Header Menu</span>
        </button>
        {logo && <HeaderLogo logo={logo} logoLink={logoLink} />}

        <HeaderLinks links={links} isBasspro={isBasspro} />
        <HeaderMobileSidebar
          isOpen={menuOpen}
          links={links}
          setIsOpen={setMenuOpen}
        />
      </div>
    </header>
  );
};

const HeaderLogo = (props: { logo: ImageType; logoLink?: string }) => {
  return (
    <MaybeLink
      className="Header-logoLink"
      href={props.logoLink}
      eventName="logo"
    >
      <div className="flex h-10 md:h-[59px] mr-2">
        <Image image={props.logo} layout="fill" />
      </div>
    </MaybeLink>
  );
};

const HeaderLinks = (props: { links: CTA[]; isBasspro: boolean }) => {
  return (
    <div className="hidden md:flex items-center">
      <ul className="flex">
        {props.links.map((item: CTA, idx) => (
          <li key={item.label}>
            <Link
              className={classNames(
                "Link Link--header Link--underlineInverse mx-2 lg:mx-[10px]",
                {
                  "text-brand-green-300 hover:text-brand-green-400":
                    idx != props.links.length - 1 && props.isBasspro,
                },
                {
                  "text-brand-green-300 hover:text-brand-green-200":
                    idx != props.links.length - 1 && !props.isBasspro,
                },
                { "text-brand-burnt-orange": idx == props.links.length - 1 }
              )}
              cta={item}
              eventName={`${idx + 1}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const HeaderMobileSidebar = (props: {
  links: CTA[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { showComponent: showSidebar, style: sidebarStyle } =
    useCustomAnimation({
      isMounted: props.isOpen,
      delayTime: 200,
      mountedStyle: { left: "0" },
      unmountedStyle: { left: "-100%" },
    });
  // Visibility controlled by the previous `showComponent`, just needed a second `style` variable for the translucent background
  const { style: bgStyle } = useCustomAnimation({
    isMounted: props.isOpen,
    delayTime: 200,
    mountedStyle: { opacity: "0.4" },
    unmountedStyle: { opacity: "0" },
  });

  if (!showSidebar) {
    return null;
  }

  return (
    <>
      <div
        style={bgStyle}
        className="fixed top-16 left-0 w-full h-full bg-black z-10"
        onClick={() => props.setIsOpen(false)}
      ></div>
      {showSidebar && (
        <div
          style={sidebarStyle}
          className="absolute top-16 left-0 h-screen font-secondary uppercase right-1/4 bg-white z-[11]"
        >
          <div className="flex flex-col">
            {props.links.map((link) => (
              <Link
                key={link.link}
                cta={link}
                className="text-sm px-4 py-2 border-t last:border-b"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export { Header };
