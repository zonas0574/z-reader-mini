import { Command } from 'vscode';
import { Commands } from '../config';
import { IReader } from '../@types';

export const defaultTreeNode: IReader = {
  type: '.txt',
  name: '',
  isDirectory: false,
  path: '',
  children: []
};

export class TreeNode {
  constructor(public data: IReader) {}

  public get name(): string {
    return this.data.name;
  }
  public set name(name:string) {
    this.data.name = name;
  }
  public get type(): string {
    return this.data.type;
  }
  public get path(): string {
    return this.data.path;
  }
  public set path(path: string) {
    this.data.path = path;
  }
  public get isDirectory(): boolean {
    return this.data.isDirectory;
  }
  public set isDirectory(boolean:boolean) {
    this.data.isDirectory = boolean;
  }

  public set children(iReader: IReader[]) {
    this.data.children = iReader;
  }

  public get children(): IReader[] {
    return this.data.children;
  }

  public get previewCommand(): Command {
    return {
      title: this.data.name,
      command: Commands.openReaderWebView,
      arguments: [this]
    };
  }
}
