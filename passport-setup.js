const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

// Giả định hàm lấy dữ liệu người dùng từ CSDL
const getUserByUsername = async (username) => {
    return { id: '123', username: 'admin', password: 'admin' };
};

const authenticateUser = async (username, password, done) => {
    const user = await getUserByUsername(username);
    if (!user || user.password !== password) {
        return done(null, false, { message: 'Tên người dùng hoặc mật khẩu không chính xác' });
    }
    return done(null, user);
};

passport.use(new LocalStrategy(authenticateUser));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    return done(null, { id: '123', username: 'admin' });
});
