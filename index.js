function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) =>
                typeof child === "object" ? child : createTextElement(child)
            ),
        },
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

function render(element, container) {
    // create dom nodes
    const dom =
        element.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(element.type)

            // 将非节点的 props 传递到 node 属性上
    const isProperty = (key) => key !== "children"
    Object.keys(element.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = element.props[name]
        })
    element.props.children.forEach((child) => render(child, dom))
    container.appendChild(dom)
}

const Sact = {
    createElement,
    render,
}

/** @jsx  Sact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
)

const container = document.getElementById("root")
Sact.render(element, container)
