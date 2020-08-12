import React from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

import { Controller } from 'react-hook-form';
import { Button } from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { UploadFile } from '_/apollo/mutations';

import AppPropTypes from '_/proptypes';

const useStyles = makeStyles({
  input: {
    display: 'none',
  },
});

const FileInput = ({
  field, message, value, ...props
}) => {
  const classes = useStyles();
  const [uploadFile] = useMutation(UploadFile, {
    onCompleted() {
      console.log('file uploaded!');
    },
  });

  return (
    <>
      <Controller
        as={(
          <Button
            variant="contained"
            color="primary"
            component="label"
            endIcon={<CloudUploadIcon />}
          >
            Upload
            <input
              name={field.name}
              type="file"
              className={classes.input}
            />
          </Button>
        )}
        onChange={([{ target: { files } }]) => {
          const f = files[0];
          console.log(f);
          uploadFile({ variables: { f } });
          field.onChange(f);
          return f;
        }}
        label={field.label}
        name={field.name}
        defaultValue={value}
        {...props}
      />
    </>
  );
};

FileInput.propTypes = {
  message: PropTypes.string,
  value: PropTypes.string.isRequired,
  field: AppPropTypes.input.isRequired,
};

FileInput.defaultProps = {
  message: '',
};

export default FileInput;
