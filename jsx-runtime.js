/**
 * Pulsar JSX runtime
 * Provides JSX transformation functions for Pulsar framework
 */
export function jsx(type, props, key) {
    return typeof type === 'function' ? type(props) : createElement(type, props);
}
export function jsxs(type, props, key) {
    return jsx(type, props, key);
}
export function Fragment(props) {
    const fragment = document.createDocumentFragment();
    if (props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach((child) => {
            if (child instanceof Node) {
                fragment.appendChild(child);
            }
        });
    }
    return fragment;
}
function createElement(type, props) {
    const element = document.createElement(type);
    if (props) {
        Object.keys(props).forEach((key) => {
            if (key === 'children') {
                const children = Array.isArray(props.children) ? props.children : [props.children];
                children.forEach((child) => {
                    if (child instanceof Node) {
                        element.appendChild(child);
                    }
                    else if (typeof child === 'string' || typeof child === 'number') {
                        element.appendChild(document.createTextNode(String(child)));
                    }
                });
            }
            else if (key === 'className') {
                element.className = props[key];
            }
            else if (key === 'innerHTML') {
                element.innerHTML = props[key];
            }
            else if (key.startsWith('on')) {
                const eventName = key.toLowerCase().substring(2);
                element.addEventListener(eventName, props[key]);
            }
            else if (key.startsWith('aria-') || key.startsWith('data-') || key === 'role') {
                element.setAttribute(key, props[key]);
            }
            else if (typeof props[key] !== 'undefined' && props[key] !== null) {
                element[key] = props[key];
            }
        });
    }
    return element;
}
