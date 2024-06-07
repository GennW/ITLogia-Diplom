const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./src/routes/category.routes');
const articleRoutes = require('./src/routes/article.routes');
const requestRoutes = require('./src/routes/request.routes');
const commentRoutes = require('./src/routes/comment.routes');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const MongoDBConnection = require("./src/utils/common/connection");
const config = require("./src/config/config");
const path = require('path');
const passport = require('passport');
const UserModel = require("./src/models/user.model");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

MongoDBConnection.getConnection((error, connection) => {
    if (error || !connection) {
        console.log('Db connection error', error);
        return;
    }
    const app = express();

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(cors());

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('x-auth'),
        secretOrKey: config.secret,
        algorithms: ["HS256"],
    }, async (payload, next) => {

        if (!payload.id) {
            return next(new Error('Не валидный токен'));
        }

        let user = null;
        try {
            user = await UserModel.findOne({_id: payload.id});
        } catch (e) {
            console.log(e);
        }

        if (user) {
            if (!user.refreshToken) {
                return next(new Error('Ошибка авторизации'));
            }
            return next(null, payload);
        }

        next(new Error('Пользователь не найден'));
    }));

    app.use(passport.initialize());

    app.use("/api", authRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/articles", articleRoutes);
    app.use("/api/requests", requestRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/users", userRoutes);

    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        res.status(err.statusCode || err.status || 500).send({error: true, message: err.message});
    });

    app.listen(config.port, () =>
        console.log(`Server started`)
    );
})

