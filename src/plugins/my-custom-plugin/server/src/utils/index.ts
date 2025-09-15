import type { Core } from "@strapi/strapi";
import { address } from "../components/address";

const registerComponent = (strapi: Core.Strapi) => {
  // Register the component
  strapi.components['shared.address'] = address as any;

  // Optional: Add component to existing content types (only if they exist)
  // Check if the content type exists before trying to modify it
  const contentType = strapi.contentTypes["api::special.special"];
  if (contentType && contentType.attributes && contentType["__schema__"]) {
    const attributes = contentType.attributes;
    const schema = contentType["__schema__"].attributes;

    const componentReference = {
      type: "component",
      repeatable: false,
      component: "shared.address",
    };

    // @ts-expect-error - attributes waiting to be updated https://github.com/strapi/strapi/blob/cc6c39db185a337e2eafce8bcf06544351e92cc5/packages/core/types/src/struct/schema.ts#L13
    attributes["address"] = componentReference;
    schema["address"] = componentReference;
  }
};

export { registerComponent };