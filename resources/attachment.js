const _sharedBaseUrl = 'https://api.worktop.io/v1';

const getAttachment = (z, bundle) => {
  return z
    .request({
      url: `${_sharedBaseUrl}/attachments/${bundle.inputData.id}`,
    })
    .then(response => {
      const attachment = response.data.data;
      attachment.id = attachment._id;
      return attachment;
    });
};

const listAttachments = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/attachments',
      params: {
        style: bundle.inputData.style,
      },
    })
    .then(response => {
      const attachments = response.data.data;
      return attachments.map(item => {
        item.id = item._id;
        return item;
      });
    });
};

const createAttachment = (z, bundle) => {
  const requestOptions = {
    url: _sharedBaseUrl + '/attachments',
    method: 'POST',
    body: {
      item_id: bundle.inputData.item_id,
      name: bundle.inputData.name,
      url: bundle.inputData.url,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  return z.request(requestOptions).then(response => {
    const attachment = response.data.data;
    attachment.id = attachment._id;
    return attachment;
  });
};

const searchAttachments = (z, bundle) => {
  return z
    .request({
      url: _sharedBaseUrl + '/attachments',
      params: {
        nameSearch: bundle.inputData.name,
      },
    })
    .then(response => {
      const matchingAttachments = response.data;

      // Only return the first matching attachment
      if (matchingAttachments && matchingAttachments.length) {
        return [matchingAttachments[0]];
      }

      return [];
    });
};

const sample = {
  _id: '5f1b2da3d8c91f003cefe7ab',
  createdAt: 1472069465,
  name: 'Website Mockup v1',
  url:
    'https://worktop-attachments.s3-accelerate.amazonaws.com/4f884b3a5679fc2f2a57e9a6148ee958c0e03348266f695bb15effe21c8f0ed1/c79ecd5037c91605882c95cdf22837063095ca7e4814ba03781fa0a7c9b8ddaa/lmi-logo-full.png',
  mime_type: 'image/png',
  date_created: '2020-07-24 18:51:15.460Z',
  date_updated: '2020-07-24 18:51:15.460Z',
  created_by: '5f1a022e5bebda0046515ffa',
  updated_by: '5f1a022e5bebda0046515ffa',
};

// This file exports a Attachment resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'attachment',
  noun: 'Attachment',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Attachment',
      description: 'Gets a attachment.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getAttachment,
      sample: sample,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Attachment',
      description: 'Trigger when a new attachment is added.',
    },
    operation: {
      inputFields: [
        {
          key: 'style',
          type: 'string',
          helpText: 'Explain what style of cuisine this is.',
        },
      ],
      perform: listAttachments,
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
      label: 'Create Attachment',
      description: 'Creates a new attachment.',
    },
    operation: {
      inputFields: [
        { key: 'item_id', required: true, type: 'string' },
        { key: 'name', required: false, type: 'string' },
        { key: 'url', required: true, type: 'string' },
      ],
      perform: createAttachment,
      sample: sample,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Attachments',
      description: 'Finds existing attachments by name.',
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchAttachments,
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
