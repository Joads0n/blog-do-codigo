const { promisify } = require('util');



module.exports = list => {
    const setAsync = promisify(list.set).bind(list);
    const existsAsync = promisify(list.exists).bind(list);
    const getAsync = promisify(list.get).bind(list);
    const delAsync = promisify(list.del).bind(list);

    return {
        async addList(key, value, expirationDate) {
            await setAsync(key, value);
            list.expireat(key, expirationDate);
        },

        async searchValue(key) {
            return getAsync(key);
        },

        async containKey(key) {
            const result = await existsAsync(key);
            return result === 1;
        },

        async delete(key) {
            await delAsync(key);
        }
    }
}