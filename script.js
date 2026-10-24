// Create a node
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// Create a stack
class Stack {
    constructor() {
        this.top = null;
        this.size = 0;
    }

    // Push
    push(value) {
        const node = new Node(value);
        node.next = this.top;
        this.top = node;
        this.size++;
    }

    // Pop
    pop() {
        if (this.top === null) {
            return null;
        }

        const value = this.top.value;
        this.top = this.top.next;
        this.size--;

        return value;
    }

    // Search
    search(value) {
        let current = this.top;
        let position = 1;

        while (current !== null) {
            if (current.value === value) {
                return position;
            }

            current = current.next;
            position++;
        }

        return -1;
    }

    // Clear
    clear() {
        this.top = null;
        this.size = 0;
    }
}

const stack = new Stack();

function render(highlightValue = null) {
    const view = document.getElementById("stackView");
    view.replaceChildren();

    document.getElementById("size").textContent = stack.size;

    if (stack.top === null) {
        view.textContent = "No nodes available.";
        return;
    }

    let current = stack.top;

    while (current !== null) {
        const node = document.createElement("div");
        node.className = "node";

        if (current === stack.top) {
            node.classList.add("top-node");
        }

        if (highlightValue !== null &&
            current.value === highlightValue) {
            node.classList.add("found-node");
        }

        const value = document.createElement("div");
        value.className = "node-value";
        value.textContent = current.value;

        const next = document.createElement("div");
        next.className = "node-next";
        next.textContent = current.next === null ? "NULL" : "NEXT ↓";

        node.append(value, next);
        view.appendChild(node);

        current = current.next;
    }
}

function getValue() {
    const input = document.getElementById("value");
    const raw = input.value.trim();

    if (raw === "") {
        return null;
    }

    const value = Number(raw);

    return Number.isSafeInteger(value) ? value : null;
}

function setStatus(message) {
    document.getElementById("status").textContent = message;
}

// Push operation
function push() {
    const value = getValue();

    if (value === null) {
        setStatus("Please enter a valid integer.");
        return;
    }

    stack.push(value);
    render();

    setStatus(value + " pushed successfully.");
    document.getElementById("value").value = "";
}

// Pop operation
function pop() {
    const value = stack.pop();

    if (value === null) {
        render();
        setStatus("Stack Underflow! The stack is empty.");
        return;
    }

    render();
    setStatus(value + " popped successfully.");
}

// Search operation
function search() {
    const value = getValue();

    if (value === null) {
        setStatus("Please enter a valid integer to search.");
        return;
    }

    const position = stack.search(value);

    if (position === -1) {
        render();
        setStatus(value + " not found.");
    } else {
        render(value);
        setStatus(value + " found at position " + position + ".");
    }
}

// Display operation
function display() {
    render();

    if (stack.size === 0) {
        setStatus("The stack is empty.");
    } else {
        setStatus("Displaying stack from top to bottom.");
    }
}

// Clear operation
function clearStack() {
    stack.clear();
    render();
    setStatus("Stack cleared successfully.");
}

// Initial display
render();
