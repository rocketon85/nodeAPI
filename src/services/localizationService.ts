import {Service} from 'typedi';
import { I18n, ConfigurationOptions }  from 'i18n';


@Service()
export class LocalizationService extends I18n  {
  constructor(options?: ConfigurationOptions) {
      super(options);
  }
}