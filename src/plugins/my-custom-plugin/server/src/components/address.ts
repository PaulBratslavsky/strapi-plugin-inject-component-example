export const address = {
  collectionName: "components_shared_addresses",
  info: {
    displayName: "Address",
    icon: "map-marker-alt",
  },
  options: {},
  attributes: {
    street1: {
      type: "string",
      required: true,
      maxLength: 255
    },
    street2: {
      type: "string",
      maxLength: 255
    },
    city: {
      type: "string",
      required: true,
      maxLength: 100
    },
    state: {
      type: "string",
      maxLength: 50
    },
    province: {
      type: "string",
      maxLength: 50
    },
    postalCode: {
      type: "string",
      maxLength: 20
    },
    zipCode: {
      type: "string",
      maxLength: 10
    },
    country: {
      type: "string",
      required: true,
      maxLength: 100
    },
    countryCode: {
      type: "string",
      maxLength: 3
    },
    latitude: {
      type: "decimal"
    },
    longitude: {
      type: "decimal"
    },
    isDefault: {
      type: "boolean",
      default: false
    },
    addressType: {
      type: "enumeration",
      enum: ["home", "work", "billing", "shipping", "other"],
      default: "home"
    },
    label: {
      type: "string",
      maxLength: 50
    }
  },
  __filename__: "address.json",
  __schema__: {
    collectionName: "components_shared_addresses",
    info: {
      displayName: "Address",
      icon: "map-marker-alt",
    },
    options: {},
    attributes: {
      street1: {
        type: "string",
        required: true,
        maxLength: 255
      },
      street2: {
        type: "string",
        maxLength: 255
      },
      city: {
        type: "string",
        required: true,
        maxLength: 100
      },
      state: {
        type: "string",
        maxLength: 50
      },
      province: {
        type: "string",
        maxLength: 50
      },
      postalCode: {
        type: "string",
        maxLength: 20
      },
      zipCode: {
        type: "string",
        maxLength: 10
      },
      country: {
        type: "string",
        required: true,
        maxLength: 100
      },
      countryCode: {
        type: "string",
        maxLength: 3
      },
      latitude: {
        type: "decimal"
      },
      longitude: {
        type: "decimal"
      },
      isDefault: {
        type: "boolean",
        default: false
      },
      addressType: {
        type: "enumeration",
        enum: ["home", "work", "billing", "shipping", "other"],
        default: "home"
      },
      label: {
        type: "string",
        maxLength: 50
      }
    },
    __filename__: "address.json",
  },
  uid: "shared.address",
  category: "shared",
  modelType: "component",
  modelName: "address",
  globalId: "ComponentSharedAddress",
};