
import { Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface MathematicsOptions {
  HTMLAttributes: Record<string, any>;
  renderMath: (expression: string) => HTMLElement;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mathematics: {
      insertMath: (expression: string) => ReturnType;
      insertInlineMath: (expression: string) => ReturnType;
      insertBlockMath: (expression: string) => ReturnType;
    };
  }
}

export const Mathematics = Node.create<MathematicsOptions>({
  name: 'mathematics',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderMath: (expression: string) => {
        const div = document.createElement('div');
        div.className = 'math-expression';
        div.textContent = expression;
        return div;
      },
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      expression: {
        default: '',
      },
      display: {
        default: 'block',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-math]',
        getAttrs: (element) => ({
          expression: (element as HTMLElement).getAttribute('data-expression'),
          display: (element as HTMLElement).getAttribute('data-display') || 'block',
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-math': true,
        'data-expression': HTMLAttributes.expression,
        'data-display': HTMLAttributes.display,
        class: `math-${HTMLAttributes.display}`,
        ...this.options.HTMLAttributes,
      },
      HTMLAttributes.expression,
    ];
  },

  addCommands() {
    return {
      insertMath:
        (expression) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { expression, display: 'block' },
          });
        },
      insertInlineMath:
        (expression) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { expression, display: 'inline' },
          });
        },
      insertBlockMath:
        (expression) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { expression, display: 'block' },
          });
        },
    };
  },
});
