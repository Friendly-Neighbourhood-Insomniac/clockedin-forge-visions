
import { Node } from '@tiptap/core';
import katex from 'katex';

export interface MathematicsOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mathematics: {
      insertMath: (expression: string) => ReturnType;
    };
  }
}

export const Mathematics = Node.create<MathematicsOptions>({
  name: 'mathematics',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      expression: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-math]',
        getAttrs: (element) => ({
          expression: (element as HTMLElement).getAttribute('data-expression'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const expression = HTMLAttributes.expression || '';
    let renderedMath = '';
    
    try {
      // Render the LaTeX expression using KaTeX
      renderedMath = katex.renderToString(expression, {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: 'warn'
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      renderedMath = `<span style="color: #cc0000;">Error: ${expression}</span>`;
    }

    return [
      'div',
      {
        'data-math': true,
        'data-expression': expression,
        class: 'math-expression bg-gray-50 p-4 rounded border text-center my-4',
        ...this.options.HTMLAttributes,
      },
      ['div', { innerHTML: renderedMath }]
    ];
  },

  addCommands() {
    return {
      insertMath:
        (expression) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { expression },
          });
        },
    };
  },
});
