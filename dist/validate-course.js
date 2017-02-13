"use strict";
const path = require("path");
const fs = require("fs-extra");
const MarkdownIt = require("markdown-it");
const caquestion = require('ca-question');
module.exports = function (dir, cb) {
    dir = [dir, "content"].join(path.sep);
    walk(dir, (err, files) => {
        if (err)
            return cb(err);
        validateCourse(files, (err, result) => {
            if (err)
                return cb(err);
            cb(null, result);
        });
    });
};
function validateCourse(files, cb) {
    const md = new MarkdownIt();
    md.use(caquestion);
    const result = {
        status: '',
        messages: new Array()
    };
    let pending = files.length;
    files.forEach(file => {
        if (isChapterFile(file)) {
            fs.readFile(file, 'utf8', (err, content) => {
                if (err)
                    return cb(err);
                try {
                    md.parse(content, {}); // We don't need the result. We are only concern if the parse() method will throw an error
                }
                catch (e) {
                    result.status = 'Fail';
                    result.messages.push(`${path.basename(file)}: ${e.message}`);
                }
                if (!--pending) {
                    if (result.status == '') {
                        result.status = 'Success';
                        result.messages.push('Course is valid');
                    }
                    cb(null, result);
                }
            });
        }
        else {
            pending--;
        }
    });
}
function isChapterFile(file) {
    if (path.extname(file) !== '.md')
        return false;
    if (file === 'SUMMARY.md' || file === 'README.md')
        return false;
    return true;
}
function walk(dir, done) {
    let results = [];
    fs.readdir(dir, (err, list) => {
        if (err)
            return done(err);
        let pending = list.length;
        if (!pending)
            return done(null, results);
        list.forEach((file) => {
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(file, (err, res) => {
                        results = results.concat(res);
                        if (!--pending)
                            done(null, results);
                    });
                }
                else {
                    results.push(file);
                    if (!--pending)
                        done(null, results);
                }
            });
        });
    });
}
