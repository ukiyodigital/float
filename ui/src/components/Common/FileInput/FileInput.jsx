/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';

import { currentSiteVar } from '_/apollo/cache';

import { Controller } from 'react-hook-form';
import { UploadFile } from '_/apollo/mutations';
import { Typography } from '@material-ui/core';

import AppPropTypes from '_/proptypes';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '16px',
    marginBottom: '8px',
    position: 'relative',
  },
  dropzoneContainer: {
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18.5px 14px',
  },
  label: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'translate(3px, -9px) scale(0.75)',
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.action.active,
    fontSize: '1rem',
  },
  typography: {
    textTransform: 'uppercase',
  },
  fieldset: {
    top: '-5px',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: '0 8px',
    overflow: 'hidden',
    position: 'absolute',
    pointerEvents: 'none',
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
  },
  legend: {
    width: 'auto',
    height: '11px',
    display: 'block',
    padding: '0',
    fontSize: '0.75em',
    visibility: 'hidden',
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.action.active,
    '& > span': {
      display: 'inline-block',
      paddingLeft: '5px',
      paddingRight: '5px',
    },
  },
}));

const FileInput = ({
  field, message, value, ...props
}) => {
  const classes = useStyles();
  const [uploadFile] = useMutation(UploadFile, {
    onCompleted({ uploadFile: { file } }) {
      const data = { id: file.id, file: file.file };
      field.onChange({ ...data });
      field.setValue(field.name, { ...data }, true);
    },
  });

  const onDrop = React.useCallback((acceptedFiles) => {
    uploadFile({ variables: { fileUpload: acceptedFiles[0], siteId: currentSiteVar()?.id } });
  }, [uploadFile]);
  const {
    getRootProps, getInputProps, isDragActive,
  } = useDropzone({ onDrop });

  const file = typeof value === 'string' ? JSON.parse(value.replace(/'/g, '"')) : value;

  return (
    <div className={classes.root}>
      <label className={classes.label} htmlFor={field.name}>{field.label}</label>
      <Controller
        as={(
          <div {...getRootProps({ className: classes.dropzoneContainer })}>
            <input name={field.name} {...getInputProps()} />
            <Typography className={classes.typography} variant="h5">
              {
                isDragActive ? (
                  'Drop the files here ...'
                ) : (
                  file?.file || 'Drag files here or browse'
                )
              }
            </Typography>
            <fieldset className={classes.fieldset}>
              <legend className={classes.legend}>
                <span>
                  {field.label}
                </span>
              </legend>
            </fieldset>
          </div>
        )}
        onChange={([{ target: { files } }]) => {
          uploadFile({ variables: { fileUpload: files[0], siteId: currentSiteVar().id } });
        }}
        name={field.name}
        defaultValue={value}
        {...props}
      />
    </div>
  );
};

FileInput.propTypes = {
  message: PropTypes.string,
  value: PropTypes.any,
  field: AppPropTypes.input.isRequired,
};

FileInput.defaultProps = {
  message: '',
  value: null,
};

export default FileInput;
