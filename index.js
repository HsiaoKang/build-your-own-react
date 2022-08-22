const ELEMENT_TYPE = {
    TEXT_ELEMENT: Symbol("text element"),
}

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
        type: ELEMENT_TYPE.TEXT_ELEMENT,
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

const Sact = {
    createElement
}

/** @jsx  Sact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
)

const container = document.getElementById("root")
ReactDOM.render(element, container)
