import { withHooks } from 'jest-react-hooks-shallow';

// Issue: https://github.com/mikeborozdin/jest-react-hooks-shallow/issues/21
export default function withHooksAsync(test) {
    return new Promise((resolve, reject) => {
        withHooks(() => {
            (async () => {
                try {
                    await test();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })();
        });
    });
}
