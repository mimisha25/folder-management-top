
const session = require('express-session');
const prisma = require('./prisma-config');

class PrismaSessionStore extends session.Store {
    constructor(options) {
        super(options);
    }

    async set(sid, sessionData, callback) {
        try {
            const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
            const data = JSON.stringify(sessionData);
            await prisma.session.upsert({
                where: { sid },
                update: { data, expiresAt },
                create: { sid, data, expiresAt },
            });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }
    async get(sid, callback) {
        try {
            const session = await prisma.session.findUnique({ where: { sid } });
            if (session) return callback(null, JSON.parse(session.data));
            return callback(null, null);
        } catch (err) {
            callback(err);
        }
    }

    async destroy(sid, callback) {
        try {
            await prisma.session.delete({ where: { sid } });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }


    async touch(sid, sessionData, callback) {
        try {
            const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
            const data = JSON.stringify(sessionData);
            await prisma.session.update({
                where: { sid },
                data: { data, expiresAt },
            });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }
}

module.exports = PrismaSessionStore;
