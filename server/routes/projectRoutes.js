const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(projectController.getProjects)
    .post(projectController.addProject);

router.route('/:id')
    .get(projectController.getProject)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);

module.exports = router;

// const permit = (...allowedRoles) => {
//     return (req, res, next) => {
//         if (!req.roles || !allowedRoles.includes(req.roles)) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }
//         next();
//     }
// }
//
// would look something like this:
// .patch(verifyJWT, permit('admin', 'project manager'), projectController.updateProject)