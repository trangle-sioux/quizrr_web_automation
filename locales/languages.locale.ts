import { validateReturnValueType } from '../utils/errors/throw-message.error.util';
import { ciEquals } from '../utils/string.util';

export class Languages {
  private abbreviationName: string;
  private englishName: string;
  private originalName: string;
  private static VALUES: Languages[] = [];
  static selectedAbbreviationLanguage: string;

  private constructor(
    abbreviationName: string,
    englishName: string,
    originalName: string,
  ) {
    this.abbreviationName = abbreviationName;
    this.englishName = englishName;
    this.originalName = originalName;
    Languages.VALUES.push(this);
  }

  public static readonly ENGLISH = new Languages('en', 'English', 'English');
  public static readonly BENGALI = new Languages('bd', 'Bengali', 'বাংলা');
  public static readonly AMHARIC = new Languages(
    'am',
    'Amharic',
    'አማርኛ (የተተረጎመ)',
  );
  public static readonly ARABIC = new Languages('ar', 'Arabic', 'عربي');
  public static readonly MANDARIN = new Languages('cn', 'Mandarin', '中文');
  public static readonly GERMAN = new Languages('de', 'German', 'Deutsch');
  public static readonly SPANISH = new Languages('es', 'Spanish', 'Español');
  public static readonly FRENCH = new Languages('fr', 'French', 'Français');
  public static readonly HINDI = new Languages('hi', 'Hindi', 'हिंदी');
  public static readonly INDONESIAN = new Languages(
    'in',
    'Indonesian',
    'Bahasa Indonesia',
  );
  public static readonly KHMER = new Languages('km', 'Khmer', 'ខ្មែរ');
  public static readonly KANNADA = new Languages('kn', 'Kannada', 'ಕನ್ನಡ');
  public static readonly LAO = new Languages('la', 'Lao', 'ພາສາລາວ');
  public static readonly MARATHI = new Languages('mr', 'Marathi', 'मराठी');
  public static readonly MALAY = new Languages('ms', 'Malay', 'Bahasa Melayu');

  public static values() {
    return Languages.VALUES;
  }

  private static valueOf(language: string): Languages | null {
    const languages: Languages[] = this.values();
    for (const element of languages) {
      const lang: string = element.abbreviationName;
      const name: string = element.englishName;
      const localizedName: string = element.originalName;
      if (
        ciEquals(lang, language) ||
        ciEquals(name, language) ||
        ciEquals(localizedName, language)
      ) {
        return new Languages(lang, name, localizedName);
      }
    }
    return null;
  }

  public static getLanguageAbbreviationOf(language?: string) {
    const lang: string = language ?? 'en';
    const valueOfLang = this.valueOf(lang);
    return validateReturnValueType(
      valueOfLang?.abbreviationName,
      `The '${language}' language is NOT valid`,
    );
  }

  public static get theSelectedAbbreviationLanguage(): string {
    let language = this.selectedAbbreviationLanguage ?? 'en';
    return language;
  }

  public static set selectedAbbreviationLanguageAs(language: string) {
    const abbreviation = this.getLanguageAbbreviationOf(language);
    this.selectedAbbreviationLanguage = abbreviation;
  }
}
