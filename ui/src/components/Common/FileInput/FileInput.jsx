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

import DeleteIcon from '@material-ui/icons/Delete';

import AppPropTypes from '_/proptypes';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '16px',
    marginBottom: '8px',
    position: 'relative',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    '&:hover fieldset': {
      border: '1px solid',
      borderColor: theme.palette.text.primary,
    },
  },
  deleteIcon: {
    padding: '10px',
    cursor: 'pointer',
  },
  disabledIcon: {
    padding: '10px',
  },
  dragText: {
    color: theme.palette.grey[500],
  },
  dropzoneContainer: {
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18.5px 14px',
    flexGrow: 1,
    '&:focus': {
      outline: 'none',
    },
    '&:focus > fieldset': {
      border: '2px solid #3f51b5',
    },
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
    borderColor: theme.palette.action.disabled,
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

  const clearFile = () => {
    field.onChange(null);
    field.setValue(field.name, null, true);
  };

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
          <div className={classes.flex}>
            <div {...getRootProps({ className: classes.dropzoneContainer })}>
              <input name={field.name} {...getInputProps()} />
              <Typography className={classes.typography} variant="h5">
                {
                  isDragActive ? (
                    <Typography variant="h6" className={classes.dragText}>
                      Drop the files here ...
                    </Typography>
                  ) : (
                    file?.file || <Typography variant="h6" className={classes.dragText}>Drag Files or Click to Browse</Typography>
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
            {file?.file ? <DeleteIcon className={classes.deleteIcon} onClick={clearFile} /> : <DeleteIcon className={classes.disabledIcon} color="disabled" />}
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
