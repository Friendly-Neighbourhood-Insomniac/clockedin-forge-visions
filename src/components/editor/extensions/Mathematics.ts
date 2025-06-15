
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
    
    if (!expression.trim()) {
      return [
        'div',
        {
          'data-math': true,
          'data-expression': '',
          class: 'math-expression bg-gray-50 p-4 rounded border text-center my-4',
          ...this.options.HTMLAttributes,
        },
        'Empty equation'
      ];
    }

    let renderedMath = '';
    
    try {
      // Render the LaTeX expression using KaTeX
      renderedMath = katex.renderToString(expression, {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: 'warn',
        trust: true,
        fleqn: false,
        leqno: false,
        colorIsTextColor: false,
        maxSize: Infinity,
        maxExpand: 1000,
        globalGroup: false
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      renderedMath = `<span style="color: #cc0000; font-family: monospace;">Error rendering: ${expression}</span>`;
    }

    return [
      'div',
      {
        'data-math': true,
        'data-expression': expression,
        class: 'math-expression bg-gray-50 p-4 rounded border text-center my-4',
        contenteditable: 'false',
        ...this.options.HTMLAttributes,
      },
      [
        'div',
        {
          class: 'katex-container',
          innerHTML: renderedMath
        }
      ]
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

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const dom = document.createElement('div');
      dom.className = 'math-expression bg-gray-50 p-4 rounded border text-center my-4';
      dom.setAttribute('data-math', 'true');
      dom.setAttribute('data-expression', node.attrs.expression || '');
      dom.contentEditable = 'false';
      
      const expression = node.attrs.expression || '';
      
      if (!expression.trim()) {
        dom.innerHTML = '<span style="color: #999;">Empty equation</span>';
        return { dom };
      }

      try {
        const rendered = katex.renderToString(expression, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: 'warn',
          trust: true
        });
        
        const container = document.createElement('div');
        container.className = 'katex-container';
        container.innerHTML = rendered;
        dom.appendChild(container);
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        dom.innerHTML = `<span style="color: #cc0000; font-family: monospace;">Error: ${expression}</span>`;
      }

      return { dom };
    };
  }
});
