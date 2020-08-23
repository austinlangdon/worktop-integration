const _sharedBaseUrl = 'https://api.worktop.io/v1';

const getTask = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/tasks/${bundle.inputData.id}`,
    })
    .then(response => response.data);
};

const listTasks = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/tasks',
      params: {
        style: bundle.inputData.style,
      },
    })
    .then(response => {
      const items = response.data.data;
      return items.map(item => {
        item.id = item._id;
        return item;
      });
    });
};

const createTask = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/tasks',
    method: 'POST',
    body: {
      task_type_id: bundle.inputData.task_type_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => response.data);
};

const searchTask = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/tasks',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then(response => {
      const matchingTasks = response.data;

      // Only return the first matching task
      if (matchingTasks && matchingTasks.length) {
        return [matchingTasks[0]];
      }

      return [];
    });
};

const sample = {
  _id: '5f42ca970b98ac00c936328b',
  workspace_id: '5f1a022e5bebda0046515ffb',
  account_id: '5f398c4e1ea233020ff9cd3c',
  account_name: 'Worktop',
  assigned_user_id: '5f1a022e5bebda0046515ffa',
  assigned_user_name: 'Austin Langdon',
  attachments: [],
  dependencies: [],
  due_date: null,
  is_communication: false,
  is_waiting: 'no',
  name: 'Follow up',
  parent_object_id: '5f398c4e1ea233020ff9cd3c',
  parent_object_type: 'account',
  priority: 3,
  processes: [],
  reserved: false,
  start_date: null,
  status_id: '5f1a022e5bebda0046516016',
  status_type: 'Active',
  task_type_id: '5f1a022e5bebda0046515fff',
  task_type_name: 'Task',
  is_deleted: false,
  source: 'ui',
  date_created: '2020-08-16T19:43:10.376Z',
  created_by: '5f1a022e5bebda0046515ffa',
  created_by_name: 'Austin Langdon',
  date_updated: '2020-08-23T19:51:47.102Z',
  updated_by: '5f1a022e5bebda0046515ffa',
};

// This file exports a Task resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'task',
  noun: 'Task',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Task',
      description: 'Gets a task.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getTask,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Task',
      description: 'Trigger when a new task is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listTasks,
      sample: sample,
    },
  },
  // If your app supports webhooks, you can define a hook method instead of a list method.
  // Zapier will turn this into a webhook Trigger on the app.
  // hook: {
  //
  // },

  // The create method on this resource becomes a Write on this app
  create: {
    display: {
      label: 'Create Task',
      description: 'Creates a new task.',
    },
    operation: {
      inputFields: [
        {
          key: 'parent_object_type',
          label: 'Parent Object Type',
          required: false,
          choices: ['Account', 'Order', 'List'],
          altersDynamicFields: true,
          helpText: 'The object type this task is related to.',
        },
        function(z, bundle) {
          if (bundle.inputData.parent_object_type === 'Account') {
            return [
              {
                key: 'parent_object_id',
                label: 'Account',
                required: true,
                type: 'string',
                dynamic: 'accountList._id.name',
                helpText: 'The account this task is related to.',
              },
            ];
          } else if (bundle.inputData.parent_object_type === 'Order') {
            return [
              {
                key: 'parent_object_id',
                label: 'Order',
                required: true,
                type: 'string',
                dynamic: 'orderList._id.name',
                helpText: 'The order this task is related to.',
              },
            ];
          } else if (bundle.inputData.parent_object_type === 'List') {
            return [
              {
                key: 'parent_object_id',
                label: 'List',
                required: true,
                type: 'string',
                dynamic: 'listList._id.name',
                helpText: 'The list this task is related to.',
              },
            ];
          }
          return [];
        },
        { key: 'name', required: false, type: 'string' },
        {
          key: 'task_type_id',
          label: 'Task Type',
          required: false,
          type: 'string',
          dynamic: 'taskTypeList._id.name',
          helpText: 'Explain how should one make the task, step by step.',
        },
        {
          key: 'description',
          required: false,
          type: 'text',
        },
        {
          key: 'user_id',
          label: 'Assignee',
          required: false,
          type: 'string',
          dynamic: 'userList._id.first_name',
          helpText: 'Explain how should one make the task, step by step.',
        },
        {
          key: 'start_date',
          required: false,
          type: 'datetime',
        },
        {
          key: 'due_date',
          required: false,
          type: 'datetime',
        },
      ],
      perform: createTask,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Task',
      description: 'Finds an existing task by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchTask,
      sample: sample,
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obviously dummy values that we can show to any user.
  sample: sample,

  // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
  // field definitions. The result will be used to augment the sample.
  // outputFields: () => { return []; }
  // Alternatively, a static field definition should be provided, to specify labels for the fields
  outputFields: [
    { key: '_id', label: 'ID' },
    { key: 'workspace_id', label: 'Workspace ID' },
    { key: 'name', label: 'Name' },
    { key: 'date_created', label: 'Date Created' },
    { key: 'date_updated', label: 'Date Updated' },
    { key: 'created_by', label: 'Created By' },
    { key: 'updated_by', label: 'Updated By' },
  ],
};
