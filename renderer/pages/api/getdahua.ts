import axios from "axios";


function textProcess(data) {
    const regex = /(?:E(?:xitedSubtotal|nteredSubtotal)|InsideSubtotal)\.Total=[0-9]+/g;
    const result = data.match(regex);
    const destObj = {};

    const l = result.length;
    for (let i = 0; i < l; i++) {
        const item = result[i];
        // Sadalu key:{val}
        const key = item.match(/^[a-zA-Z]+/);
        const val = item.match(/[0-9]+/);
        // Single result grupas met veselu kaudzi ar datu
        // tp janem [0]tais val, kas ir tas rezultats
        destObj[key[0]] = Number(val[0]);
    };
}

export default async (req, res) => {
    const url = `http://192.168.1.108/cgi-bin/videoStatServer.cgi?action=getSummary&channel=1`;

    await axios
        .get(url)
        .then(({ data }) => {
            textProcess(data.text());
        }).then((data => res.status(200).json(data)))
        .catch(({ err }) => {
            res.status(400).json({ err });
        });
};