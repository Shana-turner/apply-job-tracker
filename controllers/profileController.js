const cloudinary = require('cloudinary').v2;
const User = require('../models/user');

module.exports.getProfile = async (req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        if(!user){
            res.status(404).json({error : "User not found"});
        }

        res.render('profil', {user});
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.uploadCv = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            res.status(404).send("User didn't find");
        }

        if (user.cvUrl) {
            const publicId = user.cvUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`cvs/${publicId}`, { resource_type: 'raw' });
        }

        await User.updateOne({ _id: req.user.id }, { cvUrl: req.file.path });

        console.log("Cv upload with success");
        //res.status(200).json({ message: 'CV mis à jour avec succès.' });
        res.render('profil', {user});
    } 
    catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur.' })
    }
}

