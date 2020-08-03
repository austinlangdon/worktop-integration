const _sharedBaseUrl = 'https://auth-json-server.zapier-staging.com';

const getTask = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/tasks/${bundle.inputData.id}`,
    })
    .then((response) => response.data);
};

const listTasks = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/tasks',
      params: {
        style: bundle.inputData.style,
      },
    })
    .then((response) => response.data);
};

const createTask = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/tasks',
    method: 'POST',
    body: {
      name: bundle.inputData.name,
      directions: bundle.inputData.directions,
      authorId: bundle.inputData.authorId,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then((response) => response.data);
};

const searchTask = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/tasks',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then((response) => {
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
        { key: 'name', required: true, type: 'string' },
        {
          key: 'directions',
          required: true,
          type: 'text',
          helpText: 'Explain how should one make the task, step by step.',
        },
        {
          key: 'authorId',
          required: true,
          type: 'integer',
          label: 'Author ID',
        },
        {
          key: 'style',
          required: false,
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
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
    { key: 'id', label: 'ID' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'name', label: 'Name' },
    { key: 'directions', label: 'Directions' },
    { key: 'authorId', label: 'Author ID' },
    { key: 'style', label: 'Style' },
  ],
};
