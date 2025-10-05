import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({requestLocale}) => {
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Europe/Vienna',
    locale
  };
});
