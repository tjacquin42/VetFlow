import { Field, Label, Description, ErrorMessage } from './fieldset'
import { Input, InputGroup } from './input'

export interface FormInputProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'name' | 'onChange'> {
  name: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  /** Optional onChange handler that receives the value string directly */
  onChange?: (value: string) => void
  /** Optional unit suffix (e.g., "kg", "years") */
  unit?: string
  /** Optional left icon */
  leftIcon?: React.ReactNode
}

export function FormInput({
  name,
  label,
  error,
  hint,
  required,
  onChange,
  unit,
  leftIcon,
  ...inputProps
}: FormInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const inputElement = (
    <Input
      name={name}
      invalid={!!error}
      onChange={onChange ? handleChange : undefined}
      {...inputProps}
    />
  )

  return (
    <Field>
      {label && (
        <Label>
          {label} {required && <span className="text-red-600">*</span>}
        </Label>
      )}
      {hint && <Description>{hint}</Description>}
      {(unit || leftIcon) ? (
        <InputGroup>
          {leftIcon && <span data-slot="icon">{leftIcon}</span>}
          {inputElement}
          {unit && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
              {unit}
            </span>
          )}
        </InputGroup>
      ) : (
        inputElement
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
