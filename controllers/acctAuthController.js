const UserModel = require("../models/Users");
const ListnerModel = require("../models/Listeners");

const signUpHandler = async (req, res) => {
    const { username, email, password } = req.body;

    user = new UserModel({
        username,
        email,
        password,
        userFlag: 0,
    });

    listener = new ListnerModel({
        userId: user._id
    })

    await user.save();
    await listener.save();

    req.session.userId = user._id;
    req.session.isAuth = true;
    res.redirect("./");
};

const loginHandler = async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    req.session.userId = user._id;
    req.session.isAuth = true;

    if  (user.userFlag == 3) {
        req.session.flag = 3;
        const title = 'Producer Home Screen';
        const cssFile = 'css/producer.css';
        res.render('ProducerPage',{title, cssFile});
    }

    else {
        res.redirect('/');
    }
}

module.exports = { signUpHandler, loginHandler };