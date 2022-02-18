
const PANEL_ID = "left-panel";
const PANEL_ELEMENT = document.getElementById(PANEL_ID)!;
const HEADER_ELEMENT = document.getElementById("left-header")!;

export class LeftPanel {
    static show() {
        PANEL_ELEMENT.style.display = "flex";
    }

    static setHeader(...children: HTMLElement[]) {
        HEADER_ELEMENT.replaceChildren(...children);
    }
}
