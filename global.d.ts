// TODO: Making this be a wildcard seems problematic.
declare module "*.json" {
  const value: Record<string, { x: number; y: number }>;
  export default value;
}