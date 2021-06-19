export interface Translate {
  text: string,
  target: string,
}

declare module '@nuxt/types' {
  interface Context {
    $translate: (text: string, target: string) => void,
  }
}
