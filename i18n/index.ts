import jaMessages from '../i18n/ja';
import translate from '../translate';

interface work {
  heading: string,
  paragraph: string,
};

interface messages {
  profile: string,
  works: Array<work>,
};

/**
 * @param target 翻訳先の言語
 */
export default async (target: string) => {
  const result: messages = JSON.parse(JSON.stringify(jaMessages));

  /**
   * Profile
   */
  result.profile = await translate(result.profile, target);

  /**
   * Works
   */
  for (let i = 0; i < result.works.length; i++) {
    result.works[i].heading = await translate(result.works[i].heading, target);
    result.works[i].paragraph = await translate(result.works[i].paragraph, target);
  }

  return result;
};
