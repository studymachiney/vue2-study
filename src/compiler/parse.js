const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签 <div

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配结束标签

const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
const startTagClose = /^\s*(\/?)>/

// npmjs.com中有htmlparser2库可供使用
export function parseHTML(html) {
    const selfClosingHtml = ['br', 'hr', 'input', 'img']
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 存放元素的栈
    let currentParent // 指向栈中的最后一个元素
    let root

    while (html) {
        let textEnd = html.indexOf('<')

        if (textEnd === 0) {
            const startTagMatch = parseStartTag() //获取开始标签的匹配结果

            if (startTagMatch) {
                start(
                    startTagMatch.tagName,
                    startTagMatch.attrs,
                    startTagMatch.isClose
                )
                continue
            }

            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        } else if (textEnd > 0) {
            let text = html.substring(0, textEnd)
            if (text) {
                chars(text.trim())
                advance(textEnd)
            }
        }
    }
    return root

    function advance(length) {
        html = html.substring(length)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                isClose: false
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
                match.isClose = end[0].length === 1 ? false : true
                advance(end[0].length)
            }
            return match
        }
        return false // 不是开始标签
    }

    function start(tag, attrs, isClose) {
        let node = createAstElement(tag, attrs) // 创建一个ast节点
        if (!root) {
            // 如果为空树则当前节点为树的根节点
            root = node
        }
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }

        if (isClose || selfClosingHtml.includes(tag)) return
        stack.push(node)
        currentParent = node
    }

    function chars(text) {
        if(text.length === 0) return
        text = text.replace(/\s{2,}/g,' ')
        currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    function end(tag) {
        let node = stack.pop() //弹出最后一个标签
        if (node.tag !== tag) {
            throw new Error('closeTag is not equal startTag')
        }
        currentParent = stack[stack.length - 1]
    }

    function createAstElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
}