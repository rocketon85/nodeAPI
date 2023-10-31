import { Request, Response, NextFunction } from "express";
import { Container } from 'typedi';
import { I18n }  from 'i18n';

import { LocalizationService } from '../services/localizationService';
import { LoggerService } from '../services/loggerService';

const path = require('path');

function requireI18nMiddleware(request: Request, response: Response, next: NextFunction) {
  const logger = Container.get(LoggerService);
  Container.set(LocalizationService, new I18n({
            locales: ['en', 'de'],
            directory: path.join(__dirname, '../locales'),
  }));

  const localization = Container.get(LocalizationService);
  localization.init(request, response);
  localization.setLocale(response.locale)

  next();
}

export default requireI18nMiddleware;