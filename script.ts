const styles: Record<string, string> = {
    "style-1": "/style-1.css",
    "style-2": "/style-2.css",
    "style-3": "/style-3.css"
};

let currentStyle = "style-1";

function zmienStyl(name: string) {
    const linkEl = document.getElementById("theme-style") as HTMLLinkElement;
    linkEl.href = styles[name];
    currentStyle = name;
}


function dodajPrzyciski() {
    const styleEl = document.createElement("style");

    styleEl.textContent = `
        #style-buttons {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 400px;
            margin: 20px auto 0 auto;
            gap: 10px;
        }

        #style-buttons button {
            width: 100%;
            padding: 12px;
            font-size: 1.1rem;
            cursor: pointer;
            border: 1px solid #444;
            background: #f0f0f0;
        }
    `;
    document.head.appendChild(styleEl);
}
function dodajStyle() {
    const footer = document.querySelector("footer");

    const container = document.createElement("div");
    container.id = "style-buttons";

    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const button3 = document.createElement("button");
    button1.textContent = "Styl 1";
    button2.textContent = "Styl 2";
    button3.textContent = "Styl 3";
    button1.dataset.style = "style-1";
    button2.dataset.style = "style-2";
    button3.dataset.style = "style-3";
    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    footer.appendChild(container);
}
function aktywuj_button() {
    const buttons = document.querySelectorAll<HTMLButtonElement>("#style-buttons button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            zmienStyl(btn.dataset.style!);
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    dodajPrzyciski();
    dodajStyle();
    aktywuj_button();
});
