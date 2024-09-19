const Job = require('../models/job');

module.exports.createJob_post = async (req, res)=>{

    try {
        const { jobTitle, webSite, name, email, phone, address, origin, status, comments } = req.body;
        const user = req.user.id;

        const job = await Job.create({jobTitle, webSite, name, email, phone, address, origin, status, comments, user});
        res.status(200).json({job : job._id});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
}

module.exports.getUserJob = async(req, res)=>{

    try {
        const jobs = await Job.find({user : req.user.id}).populate('user', 'jobTitle webSite name email phone address origin status ');
        res.json({jobs})

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate('user', 'jobTitle webSite name email phone address origin status ');
    
        if (!job) {
            return res.status(404).json({ message: 'Job offer did not find' });
        }
    
        res.render('job', {job});
        } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.updateJob = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const userId = req.user.id;
        const { jobTitle, webSite, name, email, phone, address, origin, status, comments } = req.body;
    
        const updateJob = await Job.updateOne({_id : jobId, user : userId},{jobTitle, webSite, name, email, phone, address, origin, status, comments});

        if (updateJob.nModified === 0) {
            res.status(404).json({ message: 'Article non trouvé ou non autorisé' });
        }

        res.json(updateJob);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
}

module.exports.deleteJob = async (req, res)=>{
    try {
        const idJob = req.params.id;
        const userId = req.user.id;

        const deleteJob = await Job.findByIdAndDelete({ _id : idJob, user : userId});
        if(!deleteJob) {
            return res.status(404).json({ error: 'Post not found or not authorized to delete' });
        }
        res.json(deleteJob);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    


}