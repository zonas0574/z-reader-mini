import * as path from 'path';

export enum Commands {
  openReaderWebView = 'z-reader-mini.local.openReaderWebView',
  localRefresh = 'z-reader-mini.command.refresh',
  openLocalDirectory = 'z-reader-mini.command.openLocalDirectory',
  editTemplateHtml = 'z-reader-mini.editTemplateHtml',
  editTemplateCss = 'z-reader-mini.editTemplateCss',
  lastChapter = 'z-reader-mini.command.lastChapter',
  nextChapter = 'z-reader-mini.command.nextChapter',
  goChapter = 'z-reader-mini.command.goChapter',
  editStyle = 'z-reader-mini.command.editStyle',
  editHtml = 'z-reader-mini.command.editHtml',
}

export enum WebViewMessage {
  lastChapter = 'lastChapter',
  nextChapter = 'nextChapter'
}

export const TemplatePath = {
  templateCss: path.join('static', 'template', 'default', 'style.css'),
  templateHtml: path.join('static', 'template', 'default', 'index.html')
};

export const TREEVIEW_ID = 'z-reader-mini-menu';
