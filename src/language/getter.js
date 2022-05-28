'use strict';

export const languageLoader = (view, lang) => {
    return new Promise(done => {
        import(`./views/${view}`).then(labels => {
            done(labels[lang]);
        })
    })
};