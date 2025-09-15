# Strapi Plugin Extension with Register Function

This guide explains how to extend Strapi plugins using the `register` function for customizing your Strapi application.

## Overview

The `register` function in Strapi runs before application initialization and provides a powerful way to extend and customize functionality. It's particularly useful for extending existing plugins or adding custom behavior.

## Key Concepts

- **Execution Timing**: The `register` function runs before Strapi application initialization
- **Scope**: Allows registration of routes, content types, controllers, services, and middlewares
- **Plugin Extension**: Enables extending existing plugins with custom functionality

## Plugin Setup Steps

### Basic Plugin Creation

1. **Initialize a new plugin**:
   ```bash
   npx @strapi/sdk-plugin@latest init my-plugin-name
   cd my-plugin-name
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Development workflow**:
   ```bash
   # Watch for changes during development
   npm run watch
   
   # Build for production
   npm run build
   
   # Verify plugin before publishing
   npm run verify
   ```

4. **Link plugin to Strapi app** (for local development):
   ```bash
   # In your plugin directory
   npm run watch:link
   
   # In your Strapi app directory
   npm run develop
   ```

5. **Plugin structure**:
   ```
   my-plugin/
   ├── admin/           # Admin panel components
   ├── server/          # Backend logic
   │   ├── controllers/
   │   ├── routes/
   │   ├── services/
   │   └── register.ts  # Register function
   ├── package.json
   └── strapi-admin.js  # Admin entry point
   ```

## Common Extension Patterns

### 1. Middleware Injection

Create custom middleware to extend plugin functionality:

```typescript
// src/middlewares/custom-middleware.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    console.log("Custom middleware executed");
    // Add custom logic here
    await next();
  };
};
```

Register the middleware in your Strapi app:

```typescript
// src/index.ts
export default {
  register({ strapi }) {
    strapi.server.use('/api/plugin-route', customMiddleware);
  },
};
```

### 2. Plugin-Based Extension

For modular customizations, create a dedicated plugin using the Strapi SDK:

```bash
# Create a new plugin using the official SDK
npx @strapi/sdk-plugin@latest init my-extension-plugin
```

Define custom functionality within the plugin structure:

```typescript
// plugins/my-extension-plugin/server/register.ts
export default ({ strapi }) => {
  // Register custom middleware for existing plugin routes
  strapi.server.use('/api/existing-plugin/*', customMiddleware);
  
  // Extend existing plugin services
  const existingService = strapi.plugin('existing-plugin').service('serviceName');
  // Add custom methods or override existing ones
};
```

### 3. Programmatic Component Creation

**IMPORTANT**: Components must be created programmatically in the register function. DO NOT attempt to create physical component files or use `strapi.components = {}` (read-only).

#### Correct Method for Creating Components (Based on Official Strapi Documentation):

```typescript
// Define the component structure following official pattern
const addressComponent = {
  collectionName: 'components_shared_addresses',
  info: {
    displayName: 'Address',
    icon: 'map-marker-alt'
  },
  options: {},
  attributes: {
    street1: {
      type: 'string',
      required: true,
      maxLength: 255
    },
    city: {
      type: 'string',
      required: true,
      maxLength: 100
    },
    country: {
      type: 'string',
      required: true,
      maxLength: 100
    }
    // ... other attributes
  },
  __filename__: 'address.json',
  __schema__: {
    collectionName: 'components_shared_addresses',
    info: {
      displayName: 'Address',
      icon: 'map-marker-alt'
    },
    options: {},
    attributes: {
      // Duplicate all attributes here
      street1: {
        type: 'string',
        required: true,
        maxLength: 255
      }
      // ... same as above
    },
    __filename__: 'address.json'
  },
  uid: 'shared.address',
  category: 'shared',
  modelType: 'component',
  modelName: 'address',
  globalId: 'ComponentSharedAddress'
};

// Register in the register function
const register = ({ strapi }) => {
  // Register the component - official method from Strapi blog
  strapi.components['shared.address'] = addressComponent as any;

  // Optional: Add component to existing content types
  const attributes = strapi.contentType("api::article.article").attributes;
  const schema = strapi.contentType("api::article.article")["__schema__"].attributes;

  const componentReference = {
    type: "component",
    repeatable: false,
    component: "shared.address",
  };

  attributes["customField"] = componentReference;
  schema["customField"] = componentReference;
};

export default register;
```

#### Component Structure Requirements (Official Strapi Pattern):

**Required Properties:**
- `collectionName`: Database collection name (format: `components_category_name`)
- `info.displayName`: Human-readable name shown in admin
- `info.icon`: Icon identifier for admin UI
- `options`: Empty object for component options
- `attributes`: Component fields definition
- `__filename__`: Component filename reference
- `__schema__`: Complete schema duplication with same structure
- `uid`: Unique identifier (format: `category.name`)
- `category`: Component category (e.g., 'shared', 'custom')
- `modelType`: Must be 'component'
- `modelName`: Model name for the component
- `globalId`: Global identifier (format: `Component{Category}{Name}`)

#### Adding Components to Content Types:
To add a component to existing content types, modify both the `attributes` and `__schema__.attributes`:

```typescript
const attributes = strapi.contentType("api::article.article").attributes;
const schema = strapi.contentType("api::article.article")["__schema__"].attributes;

const componentReference = {
  type: "component",
  repeatable: false, // or true for multiple instances
  component: "shared.address",
};

attributes["addressField"] = componentReference;
schema["addressField"] = componentReference;
```

#### Common Mistakes to Avoid:

❌ **DO NOT** try to set `strapi.components = {}` (read-only property)
❌ **DO NOT** use `strapi.container.get('components')` (property doesn't exist)
❌ **DO NOT** use `strapi.contentType()` for components registration
❌ **DO NOT** create physical component files in register function
❌ **DO NOT** use precision/scale on decimal types (not supported)
❌ **DO NOT** omit the `__schema__` property (required for proper registration)
❌ **DO NOT** forget to duplicate attributes in both main and `__schema__` sections

✅ **DO** use `strapi.components['uid'] = definition as any` (official pattern)
✅ **DO** include complete `__schema__` object with duplicated attributes
✅ **DO** add `__filename__`, `modelName`, and `globalId` properties
✅ **DO** modify both `attributes` and `__schema__.attributes` when adding to content types
✅ **DO** follow the exact structure shown in official Strapi documentation

## Best Practices

1. **Modular Design**: Keep customizations modular using the plugin architecture
2. **Initialization Logic**: Use `register` for setup and configuration, not runtime logic
3. **Strapi Object Access**: Leverage the `strapi` object to access and modify application components
4. **Plugin Isolation**: Create separate plugins for different types of extensions
5. **Error Handling**: Always include proper error handling in custom extensions

## Plugin Extension Example

Here's a complete example of extending an existing plugin:

```typescript
// src/index.ts
export default {
  register({ strapi }) {
    // Extend existing plugin routes
    const existingPlugin = strapi.plugin('users-permissions');
    
    // Add custom validation middleware
    strapi.server.use('/api/auth/*', async (ctx, next) => {
      // Custom authentication logic
      console.log('Custom auth middleware');
      await next();
    });
    
    // Override plugin service methods
    const originalMethod = existingPlugin.service('user').find;
    existingPlugin.service('user').find = async (params) => {
      // Custom logic before calling original method
      const result = await originalMethod(params);
      // Custom logic after calling original method
      return result;
    };
  },
};
```

## Common Use Cases

- Adding custom authentication logic to existing auth plugins
- Extending content management plugins with additional validation
- Injecting custom middleware into plugin routes
- Adding custom fields or components to plugin-defined content types
- Overriding default plugin behaviors with custom implementations

## Resources

- [Strapi Plugin Development Guide](https://docs.strapi.io/developer-docs/latest/development/plugins-development.html)
- [Strapi Register Function Documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/server.html#register)
- [Strapi SDK Plugin - Official CLI Toolkit](https://github.com/strapi/sdk-plugin)
- [How to Use Register Function - Strapi Blog](https://strapi.io/blog/how-to-use-register-function-to-customize-your-strapi-app)