import { withTemplate } from "../../middlewares/withTemplate";
import RegularTemplate from "./regularTemplate";
import SimpleTemplate from "./simpleTemplate";
// import RegularThumbnail from "../../assets/templatesThumbnails/regular-landing-page.gif";

export const TemplateComponents = [
  {
    id: 0,
    name: "Simple",
    component: withTemplate(SimpleTemplate),
  },
  {
    id: 1,
    name: "regular",
    component: withTemplate(RegularTemplate),
    thumbnail: new URL(
      "../../assets/templatesThumbnails/regular-landing-page.gif",
      import.meta.url
    ).href,
  },
];
