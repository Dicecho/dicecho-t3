import { removeLngFromPathname } from '@/lib/i18n/utils'

const appendSlash = (path: string) => {
  return path.endsWith('/') ? path : `${path}/`
}

export const isUrlMatched = ({
  url,
  path,
  exact = false
}: {
  url: string;
  path: string;
  exact?: boolean;
}) => {
  const pureUrl = appendSlash(removeLngFromPathname(url));
  const purePath = appendSlash(removeLngFromPathname(path));

  return exact ? pureUrl === purePath : purePath.startsWith(pureUrl);
}