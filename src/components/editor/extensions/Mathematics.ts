
import { Node } from '@tiptap/core';

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
        parseHTML: element => element.getAttribute('data-expression'),
        renderHTML: attributes => {
          if (!attributes.expression) {
            return {};
          }
          return {
            'data-expression': attributes.expression,
          };
        },
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
    
    // Create a proper math display div that will be processed by KaTeX later
    return [
      'div',
      {
        'data-math': true,
        'data-expression': expression,
        class: 'math-expression bg-gray-50 p-4 rounded border text-center my-4',
        style: 'min-height: 60px; display: flex; align-items: center; justify-content: center; font-family: "KaTeX_Main", "Times New Roman", serif;',
        contenteditable: 'false',
        ...this.options.HTMLAttributes,
      },
      `\\(${expression}\\)` // Use LaTeX delimiters for proper rendering
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
