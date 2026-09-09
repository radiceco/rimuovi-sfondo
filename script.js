import imglyRemoveBackground from
    "https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm";

const fileInput = document.getElementById("fileInput");
const uploadBox = document.querySelector(".upload-box");
const status = document.getElementById("status");

let selectedFile = null;


// ================================
// FILE SELECTION
// ================================

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    startBackgroundRemoval(file);

});


// ================================
// DRAG & DROP
// ================================

uploadBox.addEventListener("dragover", function (event) {

    event.preventDefault();

    uploadBox.style.borderColor = "#7c5cff";
    uploadBox.style.background = "#151326";

});


uploadBox.addEventListener("dragleave", function () {

    uploadBox.style.borderColor = "#373842";
    uploadBox.style.background = "";

});


uploadBox.addEventListener("drop", function (event) {

    event.preventDefault();

    uploadBox.style.borderColor = "#373842";
    uploadBox.style.background = "";

    const file = event.dataTransfer.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        showStatus(
            "Please upload an image file.",
            "error"
        );

        return;
    }

    startBackgroundRemoval(file);

});


// ================================
// REMOVE BACKGROUND
// ================================

async function startBackgroundRemoval(file) {

    selectedFile = file;

    showStatus(
        "⏳ Loading AI... Please wait.",
        "loading"
    );


    try {

        console.log("Starting background removal...");


        const result = await imglyRemoveBackground(file, {

            progress: function (key, current, total) {

                if (total > 0) {

                    const percentage =
                        Math.round(
                            (current / total) * 100
                        );

                    showStatus(
                        `✨ Removing background... ${percentage}%`,
                        "loading"
                    );

                }

            }

        });


        console.log("Background removed successfully.");


        // Create URL for result
        const resultURL =
            URL.createObjectURL(result);


        // Show result
        showResult(resultURL);


        showStatus(
            "✅ Background removed successfully!",
            "success"
        );


    } catch (error) {

        console.error(error);

        showStatus(
            "❌ Something went wrong. Please try another image.",
            "error"
        );

    }

}


// ================================
// SHOW RESULT
// ================================

function showResult(resultURL) {

    const hero = document.querySelector(".hero");

    const oldResult =
        document.getElementById("resultArea");

    if (oldResult) {
        oldResult.remove();
    }


    const resultArea =
        document.createElement("div");

    resultArea.id = "resultArea";

    resultArea.style.marginTop = "40px";


    resultArea.innerHTML = `

        <div style="
            background:#111218;
            border:1px solid #282936;
            border-radius:20px;
            padding:25px;
        ">

            <h2 style="
                font-size:25px;
                margin-bottom:20px;
            ">
                Your Result
            </h2>


            <div style="
                background-color:white;

                background-image:
                linear-gradient(45deg,#ddd 25%,transparent 25%),
                linear-gradient(-45deg,#ddd 25%,transparent 25%),
                linear-gradient(45deg,transparent 75%,#ddd 75%),
                linear-gradient(-45deg,transparent 75%,#ddd 75%);

                background-size:30px 30px;

                background-position:
                0 0,
                0 15px,
                15px -15px,
                -15px 0;

                border-radius:15px;

                padding:20px;

                display:flex;
                justify-content:center;
                align-items:center;
            ">

                <img
                    src="${resultURL}"
                    style="
                        max-width:100%;
                        max-height:500px;
                        display:block;
                    "
                >

            </div>


            <a
                href="${resultURL}"
                download="DA-Background-result.png"
                style="
                    display:inline-block;

                    margin-top:25px;

                    background:#7c5cff;

                    color:white;

                    text-decoration:none;

                    padding:15px 30px;

                    border-radius:10px;

                    font-weight:700;
                "
            >
                ⬇ Download PNG
            </a>


            <button
                onclick="location.reload()"
                style="
                    margin-left:10px;

                    padding:15px 25px;

                    border-radius:10px;

                    border:1px solid #333641;

                    background:#191a21;

                    color:white;

                    cursor:pointer;
                "
            >
                Upload Another
            </button>

        </div>

    `;


    hero.appendChild(resultArea);

}


// ================================
// STATUS
// ================================

function showStatus(message, type) {

    if (!status) {
        return;
    }

    status.textContent = message;

    status.style.marginTop = "25px";

    if (type === "success") {

        status.style.color = "#4ade80";

    } else if (type === "error") {

        status.style.color = "#fb7185";

    } else {

        status.style.color = "#a78bfa";

    }

}
