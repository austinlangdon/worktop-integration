// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'driveFileCopy',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Drive File',
  display: {
    label: 'Copy Google Drive File',
    description: 'Copies a Google Drive file.',
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      {
        key: 'file_id',
        label: 'Template File',
        required: true,
        type: 'string',
      },
      { key: 'name', label: 'New File Name', required: true, type: 'string' },
      {
        key: 'folder_id',
        label: 'Folder For New File',
        required: true,
        type: 'string',
      },
    ],
    perform: (z, bundle) => {
      const promise = z.request({
        url: `https://script.google.com/macros/s/AKfycby-Lk2UAN9khZwnAvEYHd7okxZh2-3hOmXUAMtCjkhzV6_7Eno/exec?templateFileId=${bundle.inputData.file_id}&destinationFolderId=${bundle.inputData.folder_id}&name=${bundle.inputData.name}`,
        method: 'POST',
        body: {},
        headers: {
          'content-type': 'application/json',
        },
      });

      return promise.then(response => response.data);
    },

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: '1_MrbPAQZdNxIlphVg0g89aQajGWHqOgTjRZEd3P2-pQ',
      status: 'OK',
      name: 'New Blog Post',
      url:
        'https://docs.google.com/document/d/1_MrbPAQZdNxIlphVg0g89aQajGWHqOgTjRZEd3P2-pQ/edit?usp=drivesdk',
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'url', label: 'File URL' },
      { key: 'name', label: 'File Name' },
      { key: 'status', label: 'Status' },
    ],
  },
};
