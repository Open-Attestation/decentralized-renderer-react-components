// This file is the template registry serves as the template registry.
// When templates are loaded, their name will be compared to the keys of the
// exported object and that template will be used. If a template cannot be
// found, the default template will be used instead.

import CustomTemplate from "./customTemplate";
import GovTechDemoCert from "./govtechDemoCert";
import DriverLicense from "./driverLicense";

export const registry = {
  CUSTOM_TEMPLATE: CustomTemplate,
  GOVTECH_DEMO: GovTechDemoCert,
  DRIVER_LICENSE: DriverLicense,
  NULL: [],
};
