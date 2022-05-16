import { parseHTML } from './parse'
const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配插值表达式中的值 {{value}}

function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                if (item === '') return
                let [key, value] = item.split(':')
                obj[key.trim()] = value.trim()
            })
            attr.value = obj
        }
        str += `${attr.name}: ${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

function gen(node) {
    if (node.type === 1) {
        return codegen(node)
    } else {
        let text = node.text
        if (!defaultTagRe.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            let tokens = []
            let match
            defaultTagRe.lastIndex = 0
            let lastIndex = 0
            while ((match = defaultTagRe.exec(text))) {
                let index = match.index
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}

function genChildren(el) {
    const children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

function codegen(ast) {
    let code = `_c('${ast.tag}',${
        ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
    }${ast.children.length ? `,${genChildren(ast)}` : ''})`

    return code
}

export function compileToFunction(template) {
    // 将template生成ast语法树
    let ast = parseHTML(template.trim())

    // 生成render方法(返回虚拟DOM)

    let code = codegen(ast)
    code = `with(this){return ${code}}`
    let render = new Function(code)

   return render
}
