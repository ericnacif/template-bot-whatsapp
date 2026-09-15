/**
 * Serializa tarefas pela chave informada, mantendo usuários diferentes em paralelo.
 * Evita que duas mensagens do mesmo usuário alterem a mesma sessão ao mesmo tempo.
 */
class KeyedQueue {
    constructor() {
        this.pending = new Map();
    }

    enqueue(key, task) {
        const previous = this.pending.get(key) || Promise.resolve();
        const next = previous.catch(() => undefined).then(task);

        this.pending.set(key, next);

        return next.finally(() => {
            if (this.pending.get(key) === next) {
                this.pending.delete(key);
            }
        });
    }

    size() {
        return this.pending.size;
    }
}

module.exports = { KeyedQueue };
