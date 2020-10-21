const _sharedBaseUrl = 'https://api.worktop.io/v1';
const { normalizeCustomFields } = require('../utils');

const getCustomInputFields = async (z, bundle) => {
  const response = await z.request(`${_sharedBaseUrl}/custom_fields?type=item`);
  return normalizeCustomFields(response.data.data);
};

// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'itemUpdate',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Item',
  display: {
    label: 'Update Item',
    description: 'Updates a item.',
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      {
        key: 'item_id',
        label: 'Item',
        required: true,
        type: 'string',
        dynamic: 'itemList._id.name',
        helpText: 'Pick a item to update.',
      },
      {
        key: 'parent_id',
        label: 'Location',
        required: false,
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
        dynamic: 'userList._id.first_name',
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
    perform: (z, bundle) => {
      const promise = z.request({
        url: `${_sharedBaseUrl}/items/${bundle.inputData.item_id}`,
        method: 'PUT',
        body: {
          ...bundle.inputData,
        },
        headers: {
          'content-type': 'application/json',
        },
      });

      return promise.then(response => {
        const item = response.data.data;
        item.id = item._id;
        return item;
      });
    },

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
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
      item_type_id: '5f1a022e5bebda0046515fff',
      item_type_name: 'Item',
      is_deleted: false,
      source: 'ui',
      date_created: '2020-08-16T19:43:10.376Z',
      created_by: '5f1a022e5bebda0046515ffa',
      created_by_name: 'Austin Langdon',
      date_updated: '2020-08-23T19:51:47.102Z',
      updated_by: '5f1a022e5bebda0046515ffa',
    },

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
  },
};
