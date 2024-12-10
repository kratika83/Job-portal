import { I18n } from "i18n";
import constants from "../utils/constants.js";
import path from "path";

const lang = constants.CONST_RESP_LANG_COLLECTION;

const i18n = new I18n({
    locales: lang,
    defaultLocale: lang[0],
    directory: path.join('./', 'language')
})

export default i18n;