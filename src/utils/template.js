function renderTemplate(text = '', context = {}) {
    return text.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
        const value = path.split('.').reduce((current, key) => current?.[key], context);
        return value === undefined || value === null ? '' : String(value);
    });
}

module.exports = { renderTemplate };
