document.addEventListener("DOMContentLoaded", function() {
    const postContent = document.querySelector(".post-content");
    const wordCountDisplay = document.querySelector(".word-count");

    postContent.addEventListener("input", function() {
        const text = postContent.value.trim();
        let wordCount;

        if (text === "") {
            wordCount = 0;
        } else {
            wordCount = text.split(/\s+/).length;
        }

        wordCountDisplay.textContent = "Word count: " + wordCount;
    });
});
