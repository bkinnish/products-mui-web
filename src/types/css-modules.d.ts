/**
 * Generating TypeScript definitions for CSS Modules using SASS
 * https://www.skovy.dev/blog/generating-typescript-definitions-for-css-modules-using-sass?seed=vyf46t
 */
declare module "*.scss" {
  const styles: { [className: string]: string };
  export default styles;
}
