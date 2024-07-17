import { languages } from './settings'

const LANGUAGE_PREFIXES = languages.map(l => `/${l}`)

export const removeLngFromPathname = (pathname: string) => {
  let purePath = pathname;
  LANGUAGE_PREFIXES.forEach((prefix) => {
    if (purePath.startsWith(prefix)) {
      purePath = purePath.replace(prefix, '')
    }
  })

  return purePath;
}