import { window } from 'vscode';
import * as Path from 'path';
import * as Fs from 'fs';
import * as epub from 'epub';
import { TreeNode, defaultTreeNode } from '../explorer/TreeNode';
import { template } from '../utils/index';
import { TemplatePath } from '../config';
import { store } from '../utils/store';

class ReaderDriver {
  public getLocalBooks(path: string): Promise<string[]> {
    return new Promise(function (resolve, reject) {
      Fs.stat(path, (err, stats) => {
        if(!stats){
          Fs.mkdirSync(path)
        }
        Fs.readdir(path, (err: any, files: string[]) => {
          if (err || !files) {
            reject(err);
          }
          const result = files
            .filter((file: string) => {
              return Path.extname(file) === '.epub';
            })
            .sort((a, b) => {
              const am = a.match(/[\u4e00-\u9fa5]/g);
              const bm = b.match(/[\u4e00-\u9fa5]/g);
              const as = am ? am.join('') : a;
              const bs = bm ? bm.join('') : b;
              const _an = a.match(/\d+/g);
              const _bn = b.match(/\d+/g);
              const an = _an ? Number(_an.join('')) : 0;
              const bn = _bn ? Number(_bn.join('')) : 0;
              if (as === bs) {
                return an > bn ? 1 : -1;
              }
              return as > bs ? -1 : 1;
            });
          resolve(result);
        });
      });
    });
  }

  public getContent(treeNode: TreeNode): Promise<string> {
    const { path, chapterId } = JSON.parse(treeNode.path);
    return new Promise((resolve, reject) => {
      const book = new epub(path);
      book.on('end', () => {
        book.getChapter(chapterId, (error, text) => {
          if (error) {
            reject(error);
          }
          const html = template(store.extensionPath, TemplatePath.templateHtml, {
            contentType: 'html',
            content: text
          });
          resolve(html);
        });
      });
      book.parse();
    });
  }

  public getChapter(treeNode: TreeNode): Promise<TreeNode[]> {
    return new Promise((resolve) => {
      const book = new epub(treeNode.path);
      book.on('end', function () {
        resolve(
          book.flow.map(function (e) {
            return new TreeNode(
              Object.assign({}, defaultTreeNode, {
                type: '.epub',
                name: e.title || e.id,
                isDirectory: false,
                path: JSON.stringify({ path: treeNode.path, chapterId: e.id })
              })
            );
          })
        );
      });
      book.parse();
    });
  }

  public getFileDir(): string {
    return store.booksPath;
  }

  // 获取列表
  public async getAllBooks(): Promise<TreeNode[]> {
    const fileDir = this.getFileDir();
    const result: TreeNode[] = [];
    try {
      const filePaths = await this.getLocalBooks(fileDir);
      filePaths.forEach((filePath: string) => {
        const extname = Path.extname(filePath);
        result.push(
          new TreeNode(
            Object.assign({}, defaultTreeNode, {
              type: extname,
              name: filePath,
              isDirectory: true,
              path: Path.join(fileDir, filePath)
            })
          )
        );
      });
    } catch (error) {
      console.log(error);
      window.showWarningMessage('读取目录失败, 请检测您的目录设置');
    }
    return result;
  }
}

export const readerDriver: ReaderDriver = new ReaderDriver();
