const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签 <div

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配结束标签

const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
const startTagClose = /^\s*(\/?)>/
const defaultTagRe = /\{\{((?:|\r?\n)+?)\}\}/g // 匹配插值表达式中的值 {{value}}

export function compileToFunction(template) {
    // 将template生成ast语法树
    let ast = parseHTML(template)
    // 生成render方法(返回虚拟DOM)
}

function parseHTML(html) {
    console.log(html)

    while (html) {
        let textEnd = html.indexOf('<')

        if (textEnd === 0) {
            const startTagMatch = parseStartTag() //获取开始标签的匹配结果

            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }

            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1],)
                continue
            }
        } else if (textEnd > 0) {
            let text = html.substring(0, textEnd)
            if (text) {
                chars(text)
                advance(textEnd)
            }
        }
    }
    console.log(html)

    function advance(length) {
        html = html.substring(length)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let attr, end
            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true
                })
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false // 不是开始标签
    }

    function start(tag, attrs) {
        console.log(tag, attrs, '开始')
    }

    function chars(text) {
        console.log(text, '文字')
    }

    function end(tag) {
        console.log(tag, '结束')
    }
}
