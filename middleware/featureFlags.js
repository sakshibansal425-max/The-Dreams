const prisma = require('../config/db');

exports.attachFeatureFlags = async (req, res, next) => {
  try {
    const flags = await prisma.featureFlag.findMany();
    const flagsMap = {};
    flags.forEach((f) => {
      flagsMap[f.key] = f.enabled;
    });
    res.locals.featureFlags = flagsMap;
    next();
  } catch (error) {
    console.error('Feature flags middleware error:', error);
    res.locals.featureFlags = {
      chatbot_enabled: true,
      contact_form_enabled: true,
      mock_test_teaser_enabled: true,
      current_affairs_teaser_enabled: true,
    };
    next();
  }
};
