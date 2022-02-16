import { ExtensionContext, window, commands } from 'vscode';
import { Commands, TREEVIEW_ID } from './config';
import { store } from './utils/store';
import { treeDataProvider } from './explorer/treeDataProvider';
import * as Path from 'path';
import {
  openReaderWebView,
  openLocalDirectory,
  localRefresh,
  editTemplateHtml,
  editTemplateCss,
  nextChapter,
  lastChapter,
  goChapter
} from './commands';

export async function activate(context: ExtensionContext): Promise<void> {
  console.log('activate');
  // store
  store.extensionPath = context.extensionPath;
  store.booksPath = Path.join(context.extensionPath, 'book');
  store.globalStorageUri = context.globalStorageUri;

  context.subscriptions.push(
    treeDataProvider,
    commands.registerCommand(Commands.openReaderWebView, openReaderWebView),
    commands.registerCommand(Commands.localRefresh, localRefresh),
    commands.registerCommand(Commands.openLocalDirectory, openLocalDirectory),
    commands.registerCommand(Commands.editStyle, editTemplateCss),
    commands.registerCommand(Commands.editHtml, editTemplateHtml),
    commands.registerCommand(Commands.lastChapter, lastChapter),
    commands.registerCommand(Commands.nextChapter, nextChapter),
    commands.registerCommand(Commands.goChapter, goChapter),
    // 注册 TreeView
    window.createTreeView(TREEVIEW_ID, {
      treeDataProvider: treeDataProvider,
      showCollapseAll: true
    })
  );
  localRefresh();
}

export function deactivate() {
  console.log('eactivate.');
}
