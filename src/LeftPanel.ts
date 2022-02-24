
const PANEL_ID = "left-panel";
const PANEL_ELEMENT = document.getElementById(PANEL_ID)!;
const HEADER_ELEMENT = document.getElementById("left-header")!;
const BODY_ELEMENT = document.getElementById("left-body")!;

let usedIDs: string[] = [];

export const LeftPanel = {
    show: () => {
        PANEL_ELEMENT.style.display = "flex";
        LeftPanel.shown = true;
    },
    shown: false,
    setHeader: (...children: HTMLElement[]) => {
        HEADER_ELEMENT.replaceChildren(...children);
    },
    setBody: (name: string, elem: HTMLElement) => {
        if (usedIDs.indexOf(name) >= 0) {
            document.getElementById(name)?.replaceChildren(elem);
        } else {
            const wrapper = document.createElement("div");
            wrapper.id = name;
            wrapper.appendChild(elem);
            usedIDs.push(name);
            BODY_ELEMENT.appendChild(wrapper);
        }
    }
}
