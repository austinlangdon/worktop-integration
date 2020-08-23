const _sharedBaseUrl = 'https://api.worktop.io/v1';

const getList = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/lists/${bundle.inputData.id}`,
    })
    .then(response => response.data.data);
};

const listLists = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/lists',
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

const createList = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/lists',
    method: 'POST',
    body: {
      list_id: bundle.inputData.list_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => response.data.data);
};

const searchList = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/lists',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then(response => {
      const matchingLists = response.data.data;

      // Only return the first matching list
      if (matchingLists && matchingLists.length) {
        return [matchingLists[0]];
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

// This file exports a List resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'list',
  noun: 'List',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get List',
      description: 'Gets a list.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getList,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New List',
      description: 'Trigger when a new list is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listLists,
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
      label: 'Create List',
      description: 'Creates a new list.',
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
      perform: createList,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find List',
      description: 'Finds an existing list by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchList,
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
