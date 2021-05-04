import translate from '../translate';

export default (context, inject) => {
  inject('translate', translate);
  context.$translate = translate;
}
