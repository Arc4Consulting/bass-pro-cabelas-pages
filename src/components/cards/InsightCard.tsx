import type { CTA, ComplexImage, Image as ImageType } from "@yext/types";
import { Image, Link } from "@yext/pages-components";
import { FaChevronRight } from "react-icons/fa";
import { MaybeLink } from "../common/MaybeLink";

export interface InsightCardProps {
  image: ComplexImage;
  index: number;
}

export function InsightCard(props: InsightCardProps) {
  const { image, index } = props;

  return (
    <div>
      <MaybeLink
        className="relative flex h-[52px] md:h-auto"
        href={image.clickthroughUrl}
        eventName={`link${index}`}
      >
        <Image image={image}></Image>
        <div className="Insightcard absolute top-0 left-0 right-0 bottom-0 bg-shadow text-white tracking-[1.5px] font-bold text-base sm:text-xl items-center flex justify-center lg:justify-start lg:p-4">
          {image.description}
        </div>
      </MaybeLink>
    </div>
  );
}
