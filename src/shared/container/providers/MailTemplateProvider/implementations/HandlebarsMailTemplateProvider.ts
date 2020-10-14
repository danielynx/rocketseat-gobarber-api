import handlebars from 'handlebars';

import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    template,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const parseTemplate = await handlebars.compile(template);

    const parsedTemplate = await parseTemplate(variables);

    return parsedTemplate;
  }
}

export default HandlebarsMailTemplateProvider;
