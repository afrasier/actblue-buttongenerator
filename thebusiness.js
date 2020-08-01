// This is jank, don't stress. 

const LINK_INDEX = 1;
const DESC_INDEX = 2;

const getElem = (id) => {
    return document.getElementById(id)
}

const getLinks = (actblueSource) => {
    const pattern = /a href="(?<link>[^"]+)">(?<desc>[^<"]+)</gm;

    return [...actblueSource.matchAll(pattern)];
}

const getButtonStyles = () => {
    let styleObject = {};

    const styles = [...getElem("style").getElementsByTagName("input")];

    styles.forEach((item) => {
        if (item.type === "checkbox" && !item.checked) {
            return;
        }

        let append = item.dataset.valueappend;
        append = append ? append : "";
        styleObject[item.id] = `${item.value}${append}`;
    })

    return styleObject;
}

const generateButtonRow = (row) => {
    buttonStyleObject = getButtonStyles();

    buttonStyles = [
        "font-family:sans-serif",
        "border-top:1px solid #147fd7",
        "border-bottom:2px solid #147fd7",
        "margin:12px auto",
        "text-align:center",
        "text-decoration:none",
        "padding:12px 5px 11px",
        "display:block",
        "letter-spacing:0.075em",
    ];

    Object.entries(buttonStyleObject).forEach((e) => buttonStyles.push(`${e[0]}:${e[1]}`));

    return `
    <tr>
        <td>
            <a href="${row[LINK_INDEX]}" style="${buttonStyles.join(";")}" target="_blank">${row[DESC_INDEX]}</a>
        <td>
    </tr>
    `
}

const handleSourceChanged = () => {
    const actblueSource = getElem("actblueSource").value;

    const links = getLinks(actblueSource);

    const buttons = links.map(x => generateButtonRow(x));
    const buttonsHTML = buttons.join("\n");
    const fullHTML = `
        <center>
            ${buttonsHTML}
        </center>
    `

    getElem("generatedSource").value = fullHTML;
    getElem("preview").innerHTML = fullHTML;
}