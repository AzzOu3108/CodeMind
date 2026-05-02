// Type declarations for CSS side-effect imports
declare module "*.css" {
  const content: string;
  export default content;
}

// React-image-crop specific declaration
declare module "react-image-crop/dist/ReactCrop.css";