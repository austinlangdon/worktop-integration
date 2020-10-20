const { config: authentication, befores = [], afters = [] } = require('./authentication');

// resources
const Item = require('./resources/item');
const ItemType = require('./resources/itemType');
const User = require('./resources/user');
const Attachment = require('./resources/attachment');
const itemUpdate = require('./creates/itemUpdate');
const driveFileCopy = require('./creates/driveFileCopy');

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [itemUpdate.key]: itemUpdate,
    [driveFileCopy.key]: driveFileCopy,
  },

  resources: {
    [Item.key]: Item,
    [ItemType.key]: ItemType,
    [User.key]: User,
    [Attachment.key]: Attachment,
  },
};
