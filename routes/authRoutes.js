const { Router } = require('express');
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');
const { requireAuth, checkUser}  = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const multer = require('multer');

const router = Router();

// Configurer multer pour gérer les fichiers uploadés
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/profil",requireAuth, checkUser,profileController.getProfile);
router.post("/profil/update-cv", requireAuth, checkUser, upload.single('cv'), profileController.uploadCv);

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

router.get("/logout", authController.logout_get);

router.post("/createJob",requireAuth, checkUser, jobController.createJob_post);
router.get("/home", requireAuth, checkUser, jobController.getUserJob);
router.get('/job/:id',requireAuth, checkUser, jobController.getJobById);
router.put("/job/:id", requireAuth,checkUser,jobController.updateJob);
router.delete("/job/:id", requireAuth, checkUser, jobController.deleteJob);


module.exports = router;

