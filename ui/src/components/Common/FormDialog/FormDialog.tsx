import React from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";

import { useErrorState } from "_/hooks";

import Input from "_/components/Common/Input/Input";
import ErrorList from "_/components/Common/ErrorList/ErrorList";

interface Field {
  name: string;
  label: string;
  rules: Record<string, string>;
  inputProps?: Record<string, unknown>;
}

interface Props {
  open: boolean;
  title?: string;
  content?: string;
  fields?: Field[];
  handleClose(): void;
  submitData(data: Record<string, string>): void;
  submitText?: string;
  submitButtonProps?: ButtonProps;
}

const FormDialog: React.FC<Props> = ({
  open,
  title,
  content,
  fields = [],
  handleClose,
  submitData,
  submitText = "Save",
  submitButtonProps = {},
}) => {
  const [errors, handleError] = useErrorState([]);
  const { control, errors: formErrors, reset, handleSubmit } = useForm();

  const handleReset = () => {
    handleClose();
    handleError({ type: "reset" });
    reset();
  };

  const onSubmit = (data: Record<string, string>) => {
    handleError({ type: "reset" });
    submitData(data);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
          {fields.map((field) => (
            <Input
              key={field.name}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!formErrors[field.name] || !!errors.length}
              field={{
                name: field.name,
                label: field.label,
              }}
              message={formErrors[field.name]?.message}
              control={control}
              rules={field.rules}
              inputProps={field?.inputProps || {}}
            />
          ))}
          <ErrorList errors={errors} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset}>Cancel</Button>
          <Button type="submit" {...submitButtonProps}>
            {submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
