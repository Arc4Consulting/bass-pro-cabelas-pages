export { getPath } from "src/layouts/root/getPath";
export { transformPropsCabelas } from "src/layouts/root/transformProps";
export { getHeadConfig } from "src/layouts/root/getHeadConfig";
import { Template } from "@yext/pages";
import RootLayout from "src/layouts/root/template";
import { configBuilder } from "src/layouts/root/configBuilder";
import { DirectoryProfile, TemplateRenderProps } from "src/types/entities";

// When copying this file for multibrand, you can pass arguments
// to customize the stream id or filter
export const config = configBuilder("directory-root-cabelas", {
  savedFilterIds: ["dm_cabelasDirectory"],
});

const Root: Template<TemplateRenderProps<DirectoryProfile<never>>> = (data) => (
  <RootLayout {...data} />
);

export default Root;
