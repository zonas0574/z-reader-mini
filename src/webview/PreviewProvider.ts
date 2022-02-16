import { commands, ViewColumn } from 'vscode';
import { Webview } from './Webview';
import { IWebviewOption, IWebViewMessage } from '../@types';
import { Commands, WebViewMessage } from '../config';
import { TreeNode } from '../explorer/TreeNode';

class PreviewProvider extends Webview {
  private node = '';
  private treeNode?: TreeNode;

  public show(node: string, treeNode: TreeNode): void {
    this.node = node;
    this.treeNode = treeNode;
    this.showWebviewInternal();
  }
  public getTreeNode() {
    return this.treeNode;
  }
  public setTreeNode(treeNode: TreeNode) {
    this.treeNode = treeNode;
  }

  protected getWebviewContent(): string {
    return this.node;
  }
  protected getWebviewOption(): IWebviewOption {
    const title: string = this.treeNode?.name || '';
    return {
      title,
      viewColumn: ViewColumn.Active
    };
  }
  protected async onDidReceiveMessage(message: IWebViewMessage): Promise<void> {
    switch (message.command) {
      case WebViewMessage.lastChapter: {
        commands.executeCommand(Commands.lastChapter);
        break;
      }
      case WebViewMessage.nextChapter: {
        commands.executeCommand(Commands.nextChapter);
        break;
      }
    }
  }
}

export const previewProvider: PreviewProvider = new PreviewProvider();
