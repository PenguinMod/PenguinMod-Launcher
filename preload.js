const fs = require("fs");
const Installer = require("./installer");

const loadingScreenKey = "UnRJeVYyUk9Gbmt3SFkwaGtiUkVoV2RHNW5SazFUVWMxZE5hbEY2V2FibQ==";
const verificationKey = "WVVkR2IxbFRRakZKUjNoMllqSjBiRnBCUFQwPQ==";

window.addEventListener("DOMContentLoaded", () => {
    Installer.fs = fs;

    const verification = document.getElementById("verification");
    const verificationAttached = document.getElementById("verification_attached");
    verificationAttached.innerHTML = "ATTACHED";
    if (verification) {
        if (verification.innerText.trim() === loadingScreenKey) {
            // we are on the loading screen
            const spinner = document.getElementById("spinner");
            const status = document.getElementById("status");
            const logs = document.getElementById("logs");
            const refresh = document.getElementById("refresh");
            const copy = document.getElementById("copy");

            refresh.onclick = () => {
                location.reload();
            };
            copy.onclick = () => {
                const copyable = Installer.logs.join('\n');
                navigator.clipboard.writeText(copyable);
            };

            status.innerHTML = "Please wait...";
            // just makes sure the folder isnt empty
            fs.readFile("./penguinmod/compilation/verification.txt", "utf8", async (err, data) => {
                if (err || data !== verificationKey) {
                    console.log(err);
                    // reinstall
                    status.innerHTML = "Installing PenguinMod, this may take a bit...";
                    logs.style = "";
                    // attach log thing
                    Installer.addLogListener(() => {
                        logs.value = Installer.logs.map(log => ('> ' + log)).join("\n");
                        logs.scrollBy(0, 1073741824); // scroll down
                    });
                    // install
                    try {
                        await Installer.install("./penguinmod/compilation");
                    } catch (err) {
                        Installer.log(`ERROR: ${err}${err.stack ? `\n${err.stack}` : ''}`);
                        status.innerHTML = "Installation failed. See below for details.";
                        refresh.style = "";
                        copy.style = "";
                        spinner.style = "display: none;";
                    }
                    return;
                }
                console.log(err, data);
                // the folder exists & can be used
                status.innerHTML = "Launching...";
            });
        }
    }
});