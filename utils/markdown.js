// const highlight = require("highlight.js");
const highlight = require('highlight.js/lib/core');
highlight.registerLanguage('c-like', require('highlight.js/lib/languages/c-like'));
highlight.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
highlight.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
highlight.registerLanguage('c', require('highlight.js/lib/languages/c'));
highlight.registerLanguage('css', require('highlight.js/lib/languages/css'));
highlight.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));
highlight.registerLanguage('dos', require('highlight.js/lib/languages/dos'));
highlight.registerLanguage('go', require('highlight.js/lib/languages/go'));
highlight.registerLanguage('htmlbars', require('highlight.js/lib/languages/htmlbars'));
highlight.registerLanguage('http', require('highlight.js/lib/languages/http'));
highlight.registerLanguage('java', require('highlight.js/lib/languages/java'));
highlight.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
highlight.registerLanguage('json', require('highlight.js/lib/languages/json'));
highlight.registerLanguage('lua', require('highlight.js/lib/languages/lua'));
highlight.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'));
highlight.registerLanguage('php', require('highlight.js/lib/languages/php'));
highlight.registerLanguage('python', require('highlight.js/lib/languages/python'));
highlight.registerLanguage('python-repl', require('highlight.js/lib/languages/python-repl'));
highlight.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
highlight.registerLanguage('shell', require('highlight.js/lib/languages/shell'));
highlight.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
highlight.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));
highlight.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));

const marked = require("marked");
const tocObj = {
    add: function (text, level) {
        var anchor = `#toc${level}${++this.index}`;
        this.toc.push({ anchor: anchor, level: level, text: text });
        return anchor;
    },
    toHTML: function () {
        let levelStack = [];
        let result = [];
        const addLI = (anchor, text) => {
            result.push({ anchor, text })
        };

        this.toc.forEach(function (item) {
            if (item.level <= 3) {
                let levelIndex = levelStack.indexOf(item.level);
                // 没有找到相应level的ul标签，则将li放入新增的ul中
                if (levelIndex === -1) {
                    levelStack.unshift(item.level);
                    // addStartUL();
                    addLI(item.anchor, item.text);
                } // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
                else if (levelIndex === 0) {
                    addLI(item.anchor, item.text);
                } // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
                else {
                    while (levelIndex--) {
                        levelStack.shift();
                        // addEndUL();
                    }
                    addLI(item.anchor, item.text);
                }
            }
        });
        // 如果栈中还有level，全部出栈打上闭合标签
        while (levelStack.length) {
            levelStack.shift();
            // addEndUL();
        }
        // 清理先前数据供下次使用
        this.toc = [];
        this.index = 0;
        return result;
    },
    toc: [],
    index: 0
};

class MarkUtils {
    constructor() {
        this.rendererMD = new marked.Renderer();
        this.rendererMD.link = function (href, title, text) {
            return `<a href=${href} target="_blank" rel="noopener noreferrer title="${title}">${text}</a>\n`;
        };
        this.rendererMD.heading = function (text, level) {
            if (level <= 3) {
                var anchor = tocObj.add(text, level);
                return `<a id=${anchor} class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
            }
        };
        // highlight.configure({ useBR: true });
        marked.setOptions({
            renderer: this.rendererMD,
            headerIds: false,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code) {
                return highlight.highlightAuto(code).value;
            }
        });
    }

    async marked(data) {
        if (data) {
            let content = await marked(data); // 文章内容
            let toc = tocObj.toHTML(); // 文章目录
            return { content: content, toc: toc };
        } else {
            return null;
        }
    }
}

const markdown = new MarkUtils();

export default markdown;