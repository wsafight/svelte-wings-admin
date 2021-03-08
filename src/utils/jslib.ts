export interface JsLib {
  name: string,
  urls: string[],
  wrapper(): () => Object | null
  ready?: () => void
}
