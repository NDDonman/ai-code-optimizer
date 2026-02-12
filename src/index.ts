console.log("Index TS executing...");
try {
    const cli = require('./cli');
    console.log("Required cli:", cli);
} catch (e) {
    console.error("Require failed:", e);
}

