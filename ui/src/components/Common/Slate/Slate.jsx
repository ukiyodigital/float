/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import {
  createEditor, Editor, Node, Transforms,
} from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import { Controller } from 'react-hook-form';
import { Typography } from '@material-ui/core';

import CodeElement from '_/components/Common/Slate/Blocks/CodeElement';
import DefaultElement from '_/components/Common/Slate/Blocks/DefaultElement';


import AppPropTypes from '_/proptypes';

// Define a serializing function that takes a value and returns a string.
const serialize = (value) => (
  value
    // Return the string content of each paragraph in the value's children.
    .map((n) => Node.string(n))
    // Join them all with line breaks denoting paragraphs.
    .join('\n')
);

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) => (
  // Return a value array of children derived by splitting the string.
  string.split('\n').map((line) => ({
    children: [{ text: line }],
  }))
);


const RichTextField = ({ field, value, ...props }) => {
  const editor = React.useMemo(() => withReact(createEditor()), []);

  const renderElement = React.useCallback((prps) => {
    // eslint-disable-next-line react/prop-types
    switch (prps.element.type) {
      case 'code':
        return <CodeElement {...prps} />;
      default:
        return <DefaultElement {...prps} />;
    }
  }, []);


  return (
    <Typography>
      <Controller
        as={(
          <Slate
            editor={editor}
          >
            <Editable
              renderElement={renderElement}
              onKeyDown={(event) => {
                console.log(event);
                if (!event.ctrlKey) return;
                switch (event.key) {
                  case '`': {
                    event.preventDefault();
                    const [match] = Editor.nodes(editor, {
                      match: (n) => n.type === 'code',
                    });
                    // Otherwise, set the currently selected blocks type to "code".
                    Transforms.setNodes(
                      editor,
                      { type: match ? 'paragraph' : 'code' },
                      { match: (n) => Editor.isBlock(editor, n) },
                    );
                    break;
                  }
                  case 'b': {
                    event.preventDefault();
                    Transforms.setNodes(
                      editor,
                      { bold: true },
                      { match: (n) => Text.isText(n), split: true },
                    );
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }}
            />
          </Slate>
        )}
        onChange={([v]) => {
          console.log(v);
          field.onChange(serialize(v));
          return v;
        }}
        name={field.name}
        label={field.label}
        defaultValue={deserialize(value)}
        {...props}
      />
    </Typography>
  );
};

RichTextField.propTypes = {
  value: PropTypes.string.isRequired,
  field: AppPropTypes.input.isRequired,
};

export default RichTextField;
