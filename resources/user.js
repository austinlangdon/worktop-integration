const _sharedBaseUrl = 'https://api-staging.worktop.io/v1';

const getUser = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/users/${bundle.inputData.id}`,
    })
    .then(response => response.data.data);
};

const listUsers = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/users',
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

const createUser = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/users',
    method: 'POST',
    body: {
      user_id: bundle.inputData.user_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => response.data.data);
};

const searchUser = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/users',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then(response => {
      const matchingUsers = response.data.data;

      // Only return the first matching user
      if (matchingUsers && matchingUsers.length) {
        return [matchingUsers[0]];
      }

      return [];
    });
};

const sample = {
  _id: '5f3d7b6b142d2f006c9f7b4d',
  first_name: 'Austin',
  last_name: 'Langdon',
  full_name: 'Austin Langdon',
  email: 'austin@phoenixseolab.com',
  is_deleted: false,
  source: 'ui',
  date_created: '2020-08-16T19:43:10.376Z',
  created_by: '5f1a022e5bebda0046515ffa',
  date_updated: '2020-08-23T19:51:47.102Z',
  updated_by: '5f1a022e5bebda0046515ffa',
};

// This file exports a User resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'user',
  noun: 'User',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get User',
      description: 'Gets a user.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getUser,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New User',
      description: 'Trigger when a new user is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listUsers,
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
      label: 'Create User',
      description: 'Creates a new user.',
    },
    operation: {
      inputFields: [
        { key: 'name', required: false, type: 'string' },
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
      perform: createUser,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find User',
      description: 'Finds an existing user by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchUser,
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
