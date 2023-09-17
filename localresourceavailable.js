const wait = (ms) => {
    return new Promise((resolve) => {
        const time = Date.now();
        setTimeout(() => {
            resolve(Date.now() - time);
        }, ms);
    });
};
const isFetchOk = async (url, options) => {
    let res;
    try {
        res = await fetch(url, options);
    } catch {
        return false;
    }
    return res.ok;
};

const localResourceAvailable = (url, interval) => {
    if (typeof interval !== "number") {
        interval = 500;
    }
    return new Promise(async (resolve) => {
        let ok = false;
        while (!ok) {
            ok = await isFetchOk(url);
            if (!ok) {
                await wait(interval);
            }
        }
        resolve();
    });
};

module.exports = localResourceAvailable;