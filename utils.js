const normalizeCustomFields = async customFields => {
  const normalizedFields = [];
  for (const field of customFields) {
    let type, choices, dynamic, list;

    if (field.field_type === 'number') {
      type = 'number';
    } else if (field.field_type === 'text') {
      type = 'string';
    } else if (field.field_type === 'datetime') {
      type = 'datetime';
    } else if (field.field_type === 'datetime' || field.field_type === 'date') {
      type = 'datetime';
    } else if (field.field_type === 'choices') {
      type = 'string';
      choices = field.choices;
      list = field.accepts_multiple_values;
    } else if (field.field_type === 'user') {
      type = 'string';
      dynamic = 'userList._id.first_name';
      list = field.accepts_multiple_values;
    }

    const inputField = {
      key: field.custom_field_id.api_id,
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
