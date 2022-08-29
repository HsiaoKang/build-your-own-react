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

function createDom(fiber) {
    // create dom nodes
    const dom =
        fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)

    // 将非节点的 props 传递到 node 属性上
    const isProperty = (key) => key !== "children"
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = fiber.props[name]
        })
    return fiber
}

function commitRoot(){
    // add nodes to dom
}

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
    }
    nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let wipRoot = null

function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        // 当前帧是否还有剩余时间
        shouldYield = deadline.timeRemaining() < 1
    }

    // 整个fiber tree 构建完成后
    if(!nextUnitOfWork && wipRoot){
        commitRoot()
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    // if (fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }

    const elements = fiber.props.children
    let index = 0
    let prevSibing = null

    while (index < elements.length) {
        const element = element[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibing.sibling = newFiber
        }
        prevSibing = newFiber
        index++
    }

    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

// Fiber tree
/**
 * <div>
 *  <h1>
 *     <p>
 *     <a>
 *  </h1>
 *  <h2/>
 * </div>
 *
 * @to
 *
 * div=>h1=>p=>a=>h1=>h2=>div
 */
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
