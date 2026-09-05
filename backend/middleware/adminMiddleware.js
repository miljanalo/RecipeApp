const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                message: 'Nemate dozvolu za pristup ovoj stranici.'
            });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);

        res.status(500).json({
            message: 'Greška na serveru.'
        });
    }
};

module.exports = adminMiddleware;