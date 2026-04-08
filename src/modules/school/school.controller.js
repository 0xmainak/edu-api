import { addSchool, listSchools } from "./school.service.js";

const addSchoolHandler = async (req, res, next) => {
  try {
    const school = await addSchool(req.body);
    return res.status(201).json({ success: true, data: school });
  } catch (err) {
    next(err);
  }
};

const listSchoolsHandler = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    const schools = await listSchools(latitude, longitude);
    return res.status(200).json({ success: true, count: schools.length, data: schools });
  } catch (err) {
    next(err);
  }
};

export { addSchoolHandler, listSchoolsHandler };
