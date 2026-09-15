const { KeyedQueue } = require('../src/utils/keyedQueue');

describe('KeyedQueue', () => {
    it('processa tarefas da mesma chave na ordem de chegada', async () => {
        const queue = new KeyedQueue();
        const events = [];

        const first = queue.enqueue('user-1', async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            events.push('first');
        });
        const second = queue.enqueue('user-1', async () => {
            events.push('second');
        });

        await Promise.all([first, second]);

        expect(events).toEqual(['first', 'second']);
        expect(queue.size()).toBe(0);
    });

    it('mantém chaves diferentes independentes', async () => {
        const queue = new KeyedQueue();
        const events = [];
        let releaseFirst;

        const first = queue.enqueue(
            'user-1',
            () =>
                new Promise((resolve) => {
                    releaseFirst = () => {
                        events.push('user-1');
                        resolve();
                    };
                }),
        );
        const second = queue.enqueue('user-2', async () => {
            events.push('user-2');
        });

        await second;
        releaseFirst();
        await first;

        expect(events).toEqual(['user-2', 'user-1']);
    });

    it('continua a fila mesmo quando uma tarefa falha', async () => {
        const queue = new KeyedQueue();
        const failure = queue.enqueue('user-1', async () => {
            throw new Error('falha esperada');
        });
        const success = queue.enqueue('user-1', async () => 'ok');

        await expect(failure).rejects.toThrow('falha esperada');
        await expect(success).resolves.toBe('ok');
    });
});
