// Type definitions for better-sqlite3
declare module 'better-sqlite3' {
  export interface Database {
    prepare(statement: string): Statement;
    exec(sql: string): this;
    pragma(pragma: string, options?: any): any;
    close(): this;
    transaction<T extends any[]>(fn: (...args: T) => void): (...args: T) => void;
  }

  export interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(params: any, ...args: any[]): IterableIterator<any>;
    bind(...params: any[]): this;
  }

  export interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  export default function (filename: string, options?: any): Database;
}

// Type definitions for Electron API in renderer
declare namespace Electron {
  interface IpcRenderer {
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, listener: (event: any, ...args: any[]) => void): this;
    removeListener(channel: string, listener: (...args: any[]) => void): this;
  }
}

// Extend Window interface
declare global {
  interface Window {
    electron: {
      ipcRenderer: Electron.IpcRenderer;
    };
    api: {
      createNote: (note: any) => Promise<any>;
      getAllNotes: () => Promise<any[]>;
    };
  }
}

export {};
