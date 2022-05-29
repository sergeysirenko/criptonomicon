'use strict';

export const languageLoader = (file, lang) => {
    return new Promise(done => {
        import(`./labels/${file}`).then(labels => {
            done(labels[lang]);
        })
    })
};