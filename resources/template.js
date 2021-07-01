const _sharedBaseUrl = 'https://api-staging.worktop.io/v1';

const getTemplate = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/templates/${bundle.inputData.id}`,
    })
    .then(response => response.data);
};

const listTemplates = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/templates?status=final',
      params: {},
    })
    .then(response => {
      const items = response.data.data;
      return items.map(item => {
        item.id = item._id;
        return item;
      });
    });
};

const createTemplate = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/templates',
    method: 'POST',
    body: {
      template_id: bundle.inputData.template_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => response.data);
};

const searchTemplates = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/templates',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then(response => {
      const matchingItems = response.data;

      // Only return the first matching item
      if (matchingItems && matchingItems.length) {
        return [matchingItems[0]];
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

// This file exports a Item resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'template',
  noun: 'Template',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Template',
      description: 'Gets a template.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getTemplate,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Template',
      description: 'Trigger when a new template is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listTemplates,
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
      label: 'Create Template',
      description: 'Creates a new template.',
    },
    operation: {
      inputFields: [{ key: 'name', required: false, type: 'string' }],
      perform: createTemplate,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Templates',
      description: 'Finds existing templates by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchTemplates,
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
