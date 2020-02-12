export {}

declare global {
  interface Window {
    __SERVER_URL__: string
    __APOLLO_STATE__: object
  }
}
