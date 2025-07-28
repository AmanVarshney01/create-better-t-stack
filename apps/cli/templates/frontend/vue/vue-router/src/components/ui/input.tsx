import { defineComponent, type InputHTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes {
  class?: string
}

export const Input = defineComponent({
  name: 'Input',
  props: {
    class: String,
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    disabled: Boolean,
    modelValue: [String, Number],
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <input
        type={props.type}
        class={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          props.class
        )}
        placeholder={props.placeholder}
        disabled={props.disabled}
        value={props.modelValue}
        onInput={(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)}
      />
    )
  },
})