const validators = {
    non_empty(value) {
        return value.trim().length >= 2;
    },
    positive_integer(value) {
        return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 50;
    },
    date_br(value) {
        const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
        if (!match) return false;
        const [, day, month, year] = match.map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    },
};

function dateBrToTimestamp(value) {
    if (!validators.date_br(value)) return null;
    const [day, month, year] = value.split('/').map(Number);
    return Date.UTC(year, month - 1, day);
}

function validateInput(value, validatorName = 'non_empty', context = {}) {
    const normalizedValue = String(value || '').trim();

    if (validatorName.startsWith('date_after:')) {
        const field = validatorName.slice('date_after:'.length);
        const referenceValue = context.lead?.[field];
        const timestamp = dateBrToTimestamp(normalizedValue);
        const referenceTimestamp = dateBrToTimestamp(referenceValue);
        return timestamp !== null && referenceTimestamp !== null && timestamp > referenceTimestamp;
    }

    const validator = validators[validatorName];
    if (!validator) throw new Error(`Validador desconhecido: ${validatorName}`);
    return validator(normalizedValue);
}

module.exports = { validateInput, validators, dateBrToTimestamp };
