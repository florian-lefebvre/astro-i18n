import { defineMiddleware } from "astro:middleware";
import { options } from "virtual:astro-i18n/options";
import { withTrailingSlash } from "ufo";

const extractLocaleFromUrl = (url: URL) => {
  const pathname = withTrailingSlash(url.pathname);
  for (const locale of options.locales) {
    if (options.strategy === "prefix") {
      if (pathname.startsWith(`/${locale}/`)) {
        return locale;
      }
    } else if (options.strategy === "prefixExceptDefault") {
      if (
        locale !== options.defaultLocale &&
        pathname.startsWith(`/${locale}/`)
      ) {
        return locale;
      }
    }
  }
  return options.defaultLocale;
};

export const onRequest = defineMiddleware((context, next) => {
  context.locals.__i18n = {
    locale: extractLocaleFromUrl(context.url),
  };

  next();
});
