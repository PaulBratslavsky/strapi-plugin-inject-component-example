# Plugin Extension Using Register Function Example

This guide demonstrates how to create a Strapi plugin that programmatically registers a custom address component using the register function. This example follows the official Strapi documentation patterns for component creation.

## Prerequisites

- Strapi v5 application
- Node.js and npm/yarn installed

## Step 1: Create Basic Plugin

Initialize a new plugin using the official Strapi SDK:

``` bash
npx @strapi/sdk-plugin@latest init my-custom-plugin
```

Follow the prompts to configure your plugin:

``` bash
➜  plugin-extension npx @strapi/sdk-plugin@latest init my-custom-plugin
[INFO]  Creating a new package at:  src/plugins/my-custom-plugin
✔ plugin name … my-custom-plugin
✔ plugin display name … Plugin Example
✔ plugin description … Show how to inject custom component and collection type via plugin's register function.
✔ plugin author name … Paul Brats
✔ plugin author email …
✔ git url …
✔ plugin license … MIT
✔ register with the admin panel? … yes
✔ register with the server? … yes
✔ use editorconfig? … yes
✔ use eslint? … yes
✔ use prettier? … yes
✔ use typescript? … yes
```

## Step 2: Enable the Plugin

Add the plugin configuration to `./config/plugins.ts`:

```typescript
export default {
  // ...
  'my-custom-plugin': {
    enabled: true,
    resolve: './src/plugins/my-custom-plugin'
  },
  // ...
}
```

## Step 3: Build and Watch Plugin

Navigate to the plugin directory and start development:

``` bash
cd src/plugins/my-custom-plugin
```

``` bash
yarn build && yarn watch
```

## Step 4: Create Address Component

Following the official Strapi documentation pattern, create the component definition:

**Create:** `src/plugins/my-custom-plugin/server/src/components/address.ts`

```typescript
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
    // Complete schema duplication required
    collectionName: "components_shared_addresses",
    info: {
      displayName: "Address",
      icon: "map-marker-alt",
    },
    options: {},
    attributes: {
      // All attributes duplicated here (same as above)
    },
    __filename__: "address.json",
  },
  uid: "shared.address",
  category: "shared",
  modelType: "component",
  modelName: "address",
  globalId: "ComponentSharedAddress",
};
```

## Step 5: Create Registration Function

**Create:** `src/plugins/my-custom-plugin/server/src/utils/index.ts`

```typescript
import type { Core } from "@strapi/strapi";
import { address } from "../components/address";

const registerComponent = (strapi: Core.Strapi) => {
  // Register the component
  strapi.components['shared.address'] = address as any;

  // Optional: Add component to existing content types (only if they exist)
  const contentType = strapi.contentTypes["api::special.special"];
  if (contentType && contentType.attributes && contentType["__schema__"]) {
    const attributes = contentType.attributes;
    const schema = contentType["__schema__"].attributes;

    const componentReference = {
      type: "component",
      repeatable: false,
      component: "shared.address",
    };

    attributes["address"] = componentReference;
    schema["address"] = componentReference;
  }
};

export { registerComponent };
```

## Step 6: Update Register Function

**Update:** `src/plugins/my-custom-plugin/server/src/register.ts`

```typescript
import type { Core } from '@strapi/strapi';
import { registerComponent } from './utils';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  registerComponent(strapi);
};

export default register;
```

## Step 7: Test the Implementation

1. **Rebuild the plugin:**
   ```bash
   cd src/plugins/my-custom-plugin
   npm run build
   ```

2. **Restart Strapi:**
   ```bash
   npm run develop
   ```

3. **Verify component registration:**
   ```bash
   npm run strapi console
   ```

   In the console, check:
   ```javascript
   strapi.components['shared.address']
   ```

## Component Features

The address component includes comprehensive fields for international addresses:

### Required Fields
- `street1` - Primary street address
- `city` - City name
- `country` - Country name

### Optional Fields
- `street2` - Secondary address line
- `state` - State (US addresses)
- `province` - Province (non-US addresses)
- `postalCode` - General postal code
- `zipCode` - US ZIP code
- `countryCode` - ISO country code
- `latitude`/`longitude` - GPS coordinates
- `isDefault` - Mark as default address
- `addressType` - Type enumeration (home, work, billing, shipping, other)
- `label` - Custom address label

## Project Structure

```
src/plugins/my-custom-plugin/
├── server/
│   └── src/
│       ├── components/
│       │   └── address.ts          # Component definition
│       ├── utils/
│       │   └── index.ts            # Registration functions
│       └── register.ts             # Main register function
└── ...
```

## Key Points

1. **Official Pattern**: Follows exact pattern from official Strapi blog documentation
2. **Modular Structure**: Components separated into dedicated files
3. **Schema Duplication**: Required `__schema__` property with duplicated attributes
4. **Safe Registration**: Checks content type existence before modification
5. **Type Safety**: Proper TypeScript typing with necessary workarounds

## Troubleshooting

- **Component not showing**: Ensure plugin is built (`npm run build`) and Strapi restarted
- **TypeScript errors**: Use `as any` for component registration as shown in official docs
- **Content type errors**: Function safely checks if content types exist before modification
- **Missing in admin**: Verify all required properties (`__schema__`, `globalId`, etc.) are included

## Resources

- [How to Use Register Function - Strapi Blog](https://strapi.io/blog/how-to-use-register-function-to-customize-your-strapi-app)
- [Strapi Plugin Development Guide](https://docs.strapi.io/developer-docs/latest/development/plugins-development.html)
- [Strapi SDK Plugin - Official CLI Toolkit](https://github.com/strapi/sdk-plugin)# strapi-plugin-inject-component-example
