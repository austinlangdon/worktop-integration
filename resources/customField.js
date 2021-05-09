const _sharedBaseUrl = 'https://api-staging.worktop.io/v1';

const getCustomField = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/custom_fields/${bundle.inputData.id}`,
    })
    .then(response => response.data.data);
};

const listCustomFields = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/custom_fields',
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

const createCustomField = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/custom_fields',
    method: 'POST',
    body: {
      customField_id: bundle.inputData.customField_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => response.data.data);
};

const searchCustomField = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/custom_fields',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then(response => {
      const matchingCustomFields = response.data.data;

      // Only return the first matching customField
      if (matchingCustomFields && matchingCustomFields.length) {
        return [matchingCustomFields[0]];
      }

      return [];
    });
};

const sample = {
  _id: '5f3d7b6b142d2f006c9f7b4d',
  name: 'Content Type',
  is_deleted: false,
  source: 'ui',
  date_created: '2020-08-16T19:43:10.376Z',
  created_by: '5f1a022e5bebda0046515ffa',
  date_updated: '2020-08-23T19:51:47.102Z',
  updated_by: '5f1a022e5bebda0046515ffa',
};

// This file exports a CustomField resource. The definition below contains all of the keys available,
// and implements the customField and create methods.
module.exports = {
  key: 'customField',
  noun: 'Custom Field',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Custom Field',
      description: 'Gets a custom field.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getCustomField,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Custom Field',
      description: 'Trigger when a new custom field is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listCustomFields,
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
      label: 'Create Custom Field',
      description: 'Creates a new custom field.',
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
      perform: createCustomField,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Custom Field',
      description: 'Finds an existing custom field by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchCustomField,
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
