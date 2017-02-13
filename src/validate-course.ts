import * as path from 'path'
import * as fs from 'fs-extra'
import * as MarkdownIt from 'markdown-it'

const caquestion = require('ca-question')

module.exports = function(dir: string, cb: any) {
    dir = [dir, "content"].join(path.sep)

    walk( dir, ( err: Error, files: Array<string>) => {
        if ( err ) return cb( err )

        validateCourse( files, ( err: Error, result: any ) => {
            if ( err ) return cb( err )

            cb(null, result)
        })
    })
}

function validateCourse( files: Array<string>, cb: any ) {
    const md = new MarkdownIt()
    md.use(caquestion)

    const result = {
        status: '',
        messages: new Array()
    }

    let pending = files.length

    files.forEach( file => {
        if ( isChapterFile( file ) ) {
            fs.readFile( file, 'utf8', ( err, content ) => {
                if ( err ) return cb(err)

                try {
                    md.parse(content, {}) // We don't need the result. We are only concern if the parse() method will throw an error
                }
                catch( e ) {
                    result.status = 'Fail'
                    result.messages.push(`${path.basename(file)}: ${e.message}`)
                }

                if ( !--pending ) {
                    if ( result.status == '') {
                        result.status = 'Success'
                        result.messages.push('Course is valid')
                    }

                    cb(null, result)
                }
            })
        }
        else {
            pending--
        }
    })
}

function isChapterFile( file: string ): boolean {
    if ( path.extname(file) !== '.md' ) return false

    if ( file === 'SUMMARY.md' || file === 'README.md') return false

    return true
}

function walk( dir: string, done: any ) {
    let results: Array<string> = []

    fs.readdir(dir, (err, list) => {
        if (err) return done(err)

        let pending = list.length

        if (!pending) return done(null, results)

        list.forEach( (file) => {
            file = path.resolve(dir, file)

            fs.stat(file, (err, stat) =>  {
                if (stat && stat.isDirectory()) {
                    walk(file, (err: Error, res: Array<string>) => {
                        results = results.concat(res)
                        if (!--pending) done(null, results)
                    })
                } else {
                    results.push(file)

                    if (!--pending) done(null, results)
                }
            })
        })
    })
}
