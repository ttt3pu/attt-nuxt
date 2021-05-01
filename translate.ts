import jaMessages from './i18n/ja';
import axios from 'axios';

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
   * @param text 翻訳する文言
   */
  const translate = (text: string) => {
    return new Promise<string>((resolve) => {
      axios.get('https://script.google.com/macros/s/AKfycbzKs_lAoX052Ohijj4uFTdzk5gTOl6KI_hrjgDeGnfgD0pihi4/exec', {
        params: {
          text,
          source: 'ja',
          target,
        },
      }).then((response) => {
        resolve(response.data);
      });
    });
  };

  /**
   * Profile
   */
  result.profile = await translate(result.profile);

  /**
   * Works
   */
  for (let i = 0; i < result.works.length; i++) {
    result.works[i].heading = await translate(result.works[i].heading);
    result.works[i].paragraph = await translate(result.works[i].paragraph);
  }

  return result;
};
