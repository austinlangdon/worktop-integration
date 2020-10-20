const { normalizeCustomFields } = require('../utils');
const _sharedBaseUrl = 'https://api.worktop.io/v1';

const getItem = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/items/${bundle.inputData.id}`,
    })
    .then(response => {
      const item = response.data.data;
      item.id = item._id;
      return item;
    });
};

const listItems = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/items',
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

const createItem = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/items',
    method: 'POST',
    body: {
      item_type_id: bundle.inputData.item_type_id,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => {
    const item = response.data.data;
    item.id = item._id;
    return item;
  });
};

const searchItem = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/items',
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
  _id: '5f42ca970b98ac00c936328b',
  workspace_id: '5f1a022e5bebda0046515ffb',
  ancestors_ids: [],
  ancestors: [],
  parent_id: '5f398c4e1ea233020ff9cd3c',
  account_id: '5f398c4e1ea233020ff9cd3c',
  assigned_user_id: '5f1a022e5bebda0046515ffa',
  assigned_user_name: 'Austin Langdon',
  attachments: [],
  dependencies: [],
  due_date: null,
  is_communication: false,
  is_waiting: 'no',
  name: 'Follow up',
  priority: 3,
  processes: [],
  contacts: [],
  addresses: [],
  reserved: false,
  start_date: null,
  status_id: '5f1a022e5bebda0046516016',
  status_type: 'Active',
  item_type_id: '5f1a022e5bebda0046515fff',
  item_type_name: 'Item',
  is_deleted: false,
  source: 'ui',
  date_created: '2020-08-16T19:43:10.376Z',
  created_by: '5f1a022e5bebda0046515ffa',
  created_by_name: 'Austin Langdon',
  date_updated: '2020-08-23T19:51:47.102Z',
  updated_by: '5f1a022e5bebda0046515ffa',
};

const getCustomInputFields = async (z, bundle) => {
  if (!bundle.inputData.item_type_id) return [];

  const response = await z.request(
    `${_sharedBaseUrl}/custom_fields?item_type_id=${bundle.inputData.item_type_id}`,
  );
  return normalizeCustomFields(response.data.data);
};

// This file exports a Item resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'item',
  noun: 'Item',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Item',
      description: 'Gets a item.',
    },
    operation: {
      inputFields: [{ key: '_id', required: true }],
      perform: getItem,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Item',
      description: 'Trigger when a new item is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listItems,
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
      label: 'Create Item',
      description: 'Creates a new item.',
    },
    operation: {
      inputFields: [
        {
          key: 'parent_id',
          label: 'Location',
          required: true,
          type: 'string',
          dynamic: 'itemList._id.name',
          helpText: 'The location this item should be saved in.',
        },
        { key: 'name', required: false, type: 'string' },
        {
          key: 'item_type_id',
          label: 'Item Type',
          required: false,
          type: 'string',
          dynamic: 'itemTypeList._id.name',
          helpText: 'Explain how should one make the item, step by step.',
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
          dynamic: 'userList._id.full_name',
          helpText: 'Explain how should one make the item, step by step.',
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
        getCustomInputFields,
      ],
      perform: createItem,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Item',
      description: 'Finds an existing item by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchItem,
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
