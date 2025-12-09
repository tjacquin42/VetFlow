import { Field, Label, Description, ErrorMessage } from './fieldset'
import { Select } from './select'

export interface FormSelectProps extends Omit<React.ComponentPropsWithoutRef<typeof Select>, 'name' | 'children'> {
  name: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export function FormSelect({
  name,
  label,
  error,
  hint,
  required,
  options,
  placeholder,
  ...selectProps
}: FormSelectProps) {
  return (
    <Field>
      {label && (
        <Label>
          {label} {required && <span className="text-red-600">*</span>}
        </Label>
      )}
      {hint && <Description>{hint}</Description>}
      <Select name={name} invalid={!!error} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
