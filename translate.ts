import axios from 'axios';

/**
 * @param text 翻訳する文言
 * @param target 翻訳する言語
 */
export default (text: string, target: string) => {
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
