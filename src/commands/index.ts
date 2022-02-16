import { open } from '../utils/index';
import { store } from '../utils/store';
import { window, workspace } from 'vscode';
import { readerDriver } from '../reader';
import { TreeNode } from '../explorer/TreeNode';
import { explorerNodeManager } from '../explorer/explorerNodeManager';
import { treeDataProvider } from '../explorer/treeDataProvider';
import { previewProvider } from '../webview/PreviewProvider';
import { TemplatePath } from '../config';
import * as config from '../utils/config';
import { Notification } from '../utils/notification';
import * as path from 'path';

const showNotification = function (tip?: string, timer?: number) {
  const notification = new Notification(tip);
  if (timer) {
    setTimeout(() => {
      notification.stop();
    }, timer);
  }
};

export const openReaderWebView = function (treeNode: TreeNode) {
  readerDriver.getContent(treeNode).then(function (data: string) {
    previewProvider.show(data, treeNode);
  });
};

export const localRefresh = async function () {
  try {
    const treeNode: TreeNode[] = await explorerNodeManager.getAllBooks();
    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
};

export const openLocalDirectory = function () {
  open(readerDriver.getFileDir());
};


export const editTemplateHtml = function () {
  openTextDocument(path.join(store.extensionPath, TemplatePath.templateHtml));
};

export const editTemplateCss = function () {
  openTextDocument(path.join(store.extensionPath, TemplatePath.templateCss));
};

const openTextDocument = function (path: string) {
  workspace.openTextDocument(path).then((res) => {
    window.showTextDocument(res, {
      preview: false
    });
  });
};

// 上一个章节
export const lastChapter = function () {
  const treeNode = previewProvider.getTreeNode();
  let isSuccess = false;
  if (treeNode) {
    const nextNode = explorerNodeManager.lastChapter(treeNode);
    if (nextNode) {
      openReaderWebView(nextNode);
      const { path } = JSON.parse(nextNode.path);
      config.set(path, 'path', nextNode.path);
      config.set(path, 'name', nextNode.name);
      isSuccess = true;
    }
  }
  if (!isSuccess) {
    showNotification('没有上一章了~', 1000);
  }
};
// 下一个章节
export const nextChapter = function () {
  const treeNode = previewProvider.getTreeNode();
  let isSuccess = false;
  if (treeNode) {
    const nextNode = explorerNodeManager.nextChapter(treeNode);
    if (nextNode) {
      openReaderWebView(nextNode);
      const { path } = JSON.parse(nextNode.path);
      config.set(path, 'path', nextNode.path);
      config.set(path, 'name', nextNode.name);
      isSuccess = true;
    }
  }
  if (!isSuccess) {
    showNotification('没有下一章了~', 1000);
  }
};
// 跳到章节
export const goChapter = function (treeNode:TreeNode) {
  let path;
  if(treeNode.isDirectory){
    path = treeNode.path;
  }else{
    path = JSON.parse(treeNode.path).path;
  }
  if(!config.get(path, 'path')){
    showNotification('本小说没有保存进度~', 1000);
  }else{
    treeNode.path = config.get(path, 'path');
    treeNode.name = config.get(path, 'name');
    openReaderWebView(treeNode);
  }
};
