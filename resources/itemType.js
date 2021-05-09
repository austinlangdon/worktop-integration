const _sharedBaseUrl = 'https://api-staging.worktop.io/v1';

const getItemType = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/item_types/${bundle.inputData.id}`,
    })
    .then(response => response.data);
};

const listItemTypes = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/item_types?status=final',
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

const createItemType = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/item_types',
    method: 'POST',
    body: {
      item_type_id: bundle.inputData.item_type_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => response.data);
};

const searchItemTypes = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/item_types',
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
  key: 'itemType',
  noun: 'Item Type',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Item Type',
      description: 'Gets a item type.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getItemType,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Item Type',
      description: 'Trigger when a new item type is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listItemTypes,
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
      label: 'Create Item Type',
      description: 'Creates a new item type.',
    },
    operation: {
      inputFields: [{ key: 'name', required: false, type: 'string' }],
      perform: createItemType,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Item Types',
      description: 'Finds existing item types by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchItemTypes,
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
