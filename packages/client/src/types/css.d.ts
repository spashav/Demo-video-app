declare module '*.css' {
  const classes: Record<string, string>

  export default classes
}

declare module '*.svg' {
  export const ReactComponent: React.ElementType
}
