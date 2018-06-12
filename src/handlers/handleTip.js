const {User, Tip} = require('../db');

module.exports = async (original, comment, amount) => {
    return new Promise(async (res, rej) => {
        const _tipper = await original.author;
        const _receiver = await comment.author;


        const tipper = await User.findOne({username: _tipper.name});
        let receiver = await User.findOne({username: _receiver.name});

        async function createUser(username) {
            await welcomeMessage(username);
            return User.create({username});
        }


        if (!tipper) {
            await createUser(_tipper.name);
            await original.reply('You do not have any funds to tip with!');
            rej(0);
        }
        else if (!receiver) {
            receiver = await createUser(_receiver.name);
        }
        else if (receiver.username == tipper.username) {
            await original.reply('You may not tip yourself!');
            rej(0);
        }
        else {
            await User.tip(tipper, receiver, amount).then(() => {

                const tip = new Tip({tipper: tipper._id, tipped: receiver._id, amount});
                tip.save((err) => {
                    if (err) rej(err);
                    res(true);
                });

            }).catch((err) => {
                if(err.message == "insufficient funds") rej(1);
                else rej(0);

            });
        }
    });

};
