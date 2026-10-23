// Stack implemented with a singly linked list. The head pointer is the TOP.
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.top = null;
    this.size = 0;
  }

  // Push a node at the head: O(1).
  push(value) {
    const node = new Node(value);
    node.next = this.top;
    this.top = node;
    this.size++;
  }

  // Pop the head node: O(1).
  pop() {
    if (this.top === null) return { success: false, value: null };
    const value = this.top.value;
    this.top = this.top.next;
    this.size--;
    return { success: true, value };
  }

  peek() {
    return this.top === null ? null : this.top.value;
  }

  // Search from top to bottom; return a 1-based position or -1.
  search(value) {
    let current = this.top;
    let position = 1;
    while (current !== null) {
      if (current.value === value) return position;
      current = current.next;
      position++;
    }
    return -1;
  }

  clear() {
    this.top = null;
    this.size = 0;
  }
}

const stack = new Stack();
const pushForm = document.getElementById("pushForm");
const pushInput = document.getElementById("pushValue");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchValue");
const stackView = document.getElementById("stackView");
const sequenceView = document.getElementById("sequenceView");
const statusMessage = document.getElementById("status");
const sizeLabel = document.getElementById("sizeLabel");
const topLabel = document.getElementById("topLabel");
const topPointer = document.getElementById("topPointer");
let highlightedValue = null;

function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";
  if (type) statusMessage.classList.add(type);
}

function readInteger(input) {
  const raw = input.value.trim();
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
}

function createArrow() {
  const arrow = document.createElement("span");
  arrow.className = "sequence-arrow";
  arrow.textContent = "→";
  return arrow;
}

// Render by traversing the linked list; the array is not used to store nodes.
function render() {
  stackView.replaceChildren();
  sequenceView.replaceChildren();
  sizeLabel.textContent = String(stack.size);
  topLabel.textContent = stack.top === null ? "—" : String(stack.top.value);
  topPointer.hidden = stack.top === null;

  if (stack.top === null) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const symbol = document.createElement("div");
    symbol.className = "empty-symbol";
    symbol.textContent = "∅";
    const title = document.createElement("strong");
    title.textContent = "Your stack is empty";
    const detail = document.createElement("span");
    detail.textContent = "Push a value to create a node.";
    empty.append(symbol, title, detail);
    stackView.appendChild(empty);
    sequenceView.textContent = "No nodes to display.";
    return;
  }

  let current = stack.top;
  while (current !== null) {
    const node = document.createElement("div");
    node.className = "stack-node";
    if (current === stack.top) node.classList.add("top-node");
    if (highlightedValue !== null && current.value === highlightedValue) {
      node.classList.add("found-node");
    }

    const value = document.createElement("div");
    value.className = "node-value";
    value.textContent = String(current.value);

    const pointer = document.createElement("div");
    pointer.className = "node-pointer";
    const pointerText = document.createElement("span");
    pointerText.textContent = current.next === null ? "next: NULL" : "next";
    const arrow = document.createElement("span");
    arrow.className = "pointer-arrow";
    arrow.textContent = current.next === null ? "∅" : "↓";
    pointer.append(pointerText, arrow);
    node.append(value, pointer);
    stackView.appendChild(node);

    const sequenceItem = document.createElement("span");
    sequenceItem.className = "sequence-item";
    sequenceItem.textContent = String(current.value);
    sequenceView.appendChild(sequenceItem);
    if (current.next !== null) sequenceView.appendChild(createArrow());
    current = current.next;
  }

  const nullLabel = document.createElement("span");
  nullLabel.className = "sequence-null";
  nullLabel.textContent = "NULL";
  sequenceView.append(createArrow(), nullLabel);
}

pushForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = readInteger(pushInput);
  if (value === null) {
    showStatus("Enter a valid whole-number value to push.", "error");
    return;
  }
  stack.push(value);
  highlightedValue = null;
  render();
  showStatus(`Push successful: ${value} is now the top node.`, "success");
  pushInput.value = "";
  pushInput.focus();
});

document.getElementById("popBtn").addEventListener("click", () => {
  const result = stack.pop();
  highlightedValue = null;
  if (!result.success) {
    render();
    showStatus("Stack underflow: cannot pop because the stack is empty.", "error");
    return;
  }
  render();
  showStatus(`Pop successful: removed ${result.value} from the top.`, "success");
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = readInteger(searchInput);
  if (value === null) {
    showStatus("Enter a valid whole-number value to search.", "error");
    return;
  }
  const position = stack.search(value);
  highlightedValue = position === -1 ? null : value;
  render();
  if (position === -1) {
    showStatus(`${value} was not found in the stack.`, "error");
  } else {
    showStatus(`Found ${value} at position ${position} from the top.`, "success");
  }
});

document.getElementById("displayBtn").addEventListener("click", () => {
  highlightedValue = null;
  render();
  showStatus(stack.size === 0 ? "The stack is empty." : `Displayed ${stack.size} node(s), from top to bottom.`);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  stack.clear();
  highlightedValue = null;
  render();
  showStatus("Stack cleared successfully. All nodes have been removed.", "success");
});

render();
