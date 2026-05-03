const bcrypt = require('bcryptjs');

const users = [ 
    {
        name: 'Admin User',
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
        isVerified: true
    },
    {
        name: 'jone Doe',
        email: "jone@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isVerified: true
    }
]

module.exports = users;