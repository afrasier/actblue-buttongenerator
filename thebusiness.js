// This is jank, don't stress. 

const LINK_INDEX = 1;
const DESC_INDEX = 2;

const getElem = (id) => {
    return document.getElementById(id)
}

const getInfo = (actblueSource) => {
    const pattern = /"info">(?<info>[^<]+)</m;

    const match = actblueSource.match(pattern);

    return match;
}

const getLinks = (actblueSource) => {
    const pattern = /a href="(?<link>[^"]+)">(?<desc>[^<"]+)</gm;

    return [...actblueSource.matchAll(pattern)];
}

const getButtonStyles = (doAppend) => {
    let styleObject = {};

    const styles = [...getElem("style-left").getElementsByTagName("input"), ...getElem("style-right").getElementsByTagName("input")];

    styles.forEach((item) => {
        if (item.type === "checkbox" && !item.checked) {
            return;
        }

        let append = item.dataset.valueappend;
        append = append && doAppend ? append : "";
        styleObject[item.id] = `${item.value}${append}`;
    })

    return styleObject;
}

const generateButtonRow = (row) => {
    buttonStyleObject = getButtonStyles(true);

    buttonStyles = [
        "border-top-style: solid",
        "border-bottom-style: solid",
        "border-left-style: solid",
        "border-right-style: solid",
        "margin:12px auto",
        "text-align:center",
        "text-decoration:none",
        "padding:12px 5px 11px",
        "display:block",
        "letter-spacing:0.075em",
    ];

    Object.entries(buttonStyleObject).forEach((e) => buttonStyles.push(`${e[0]}:${e[1]}`));

    return `
    <p>
            <a href="${row[LINK_INDEX]}" style="${buttonStyles.join(";")}" target="_blank">${row[DESC_INDEX]}</a>
    </p>
    `
}

const setURLStyle = () => {
    const styleObject = getButtonStyles();
    const queryParams = new URLSearchParams(window.location.search);

    Object.entries(styleObject).forEach((e) => queryParams.set(e[0], e[1]));
    history.replaceState(null, null, "?" + queryParams.toString());
}

const setStyleFromURL = () => {
    const queryParams = new URLSearchParams(window.location.search);

    for (const [key, value] of queryParams) {
        const elem = getElem(key);
        if (elem !== null) {
            elem.value = value;
        }
    }
}

const handleSourceChanged = () => {
    const actblueSource = getElem("actblueSource").value;

    const links = getLinks(actblueSource);
    const info = getInfo(actblueSource);
    let infoHTML = "";

    if (info !== null) {
        infoHTML = `
        <p style="font-family:Arial;font-size:12px;line-height:140%">
            <em>${info[1]}</em>
        </p>
        `
    }

    const buttons = links.map(x => generateButtonRow(x));
    const buttonsHTML = buttons.join("\n");
    const fullHTML = `
        <center>
            ${infoHTML}
            ${buttonsHTML}
        </center>
    `

    getElem("generatedSource").value = fullHTML;
    getElem("preview").innerHTML = fullHTML;

    setURLStyle();
}