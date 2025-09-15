import type { Core } from '@strapi/strapi';
import { registerComponent } from './utils';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  registerComponent(strapi);
};

export default register;
