const validateCourse = require('../validate-course');
try {
    validateCourse(process.argv[2], (err, results) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log(results);
        }
    });
}
catch (e) {
    console.log(e.message);
}
