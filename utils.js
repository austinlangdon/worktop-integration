const normalizeCustomFields = async customFields => {
  const normalizedFields = [];
  for (const field of customFields) {
    let type, choices, dynamic, list;

    if (field.type === 'number') {
      type = 'number';
    } else if (field.type === 'text') {
      type = 'string';
    } else if (field.type === 'datetime') {
      type = 'datetime';
    } else if (field.type === 'datetime' || field.type === 'date') {
      type = 'datetime';
    } else if (field.type === 'choices') {
      type = 'string';
      choices = field.choices;
      list = field.accepts_multiple_values;
    } else if (field.type === 'user') {
      type = 'string';
      dynamic = 'userList._id.first_name';
      list = field.accepts_multiple_values;
    }

    const inputField = {
      key: `custom:${field._id}`,
      label: field.name,
      required: false,
      helpText: 'This is a custom field',
      type,
      choices,
      dynamic,
      list,
    };

    normalizedFields.push(inputField);
  }
  return normalizedFields;
};

const getParentObjectField = () => {};

module.exports = { normalizeCustomFields, getParentObjectField };
