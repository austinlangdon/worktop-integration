const { config: authentication, befores = [], afters = [] } = require('./authentication');

const Task = require('./resources/task');
const TaskType = require('./resources/taskType');
const User = require('./resources/user');
const Account = require('./resources/account');
const Order = require('./resources/order');
const List = require('./resources/list');

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
  creates: {},

  resources: {
    [Task.key]: Task,
    [TaskType.key]: TaskType,
    [User.key]: User,
    [Account.key]: Account,
    [Order.key]: Order,
    [List.key]: List,
  },
};
