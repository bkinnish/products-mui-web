/**
 * Typescript definition for importing a json file
 * https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript
 */

declare module "*.json" {
  const json: any;
  export default json;
}
