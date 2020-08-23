const _sharedBaseUrl = 'https://api.worktop.io/v1';

const getTaskType = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/task_types/${bundle.inputData.id}`,
    })
    .then(response => response.data);
};

const listTaskTypes = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/task_types',
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

const createTaskType = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/task_types',
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

const searchTaskTypes = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/task_types',
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
  id: 1,
  createdAt: 1472069465,
  name: 'Best Spagetti Ever',
  authorId: 1,
  directions: '1. Boil Noodles\n2.Serve with sauce',
  style: 'italian',
};

// This file exports a Task resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'taskType',
  noun: 'Task Type',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Task Type',
      description: 'Gets a task type.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getTaskType,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Task Type',
      description: 'Trigger when a new task type is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listTaskTypes,
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
      label: 'Create Task Type',
      description: 'Creates a new task type.',
    },
    operation: {
      inputFields: [{ key: 'name', required: false, type: 'string' }],
      perform: createTaskType,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Task Types',
      description: 'Finds existing task types by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchTaskTypes,
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