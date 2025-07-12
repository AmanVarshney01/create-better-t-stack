import { defineComponent, type PropType } from 'vue'
import {
  DropdownMenuContent as RadixDropdownMenuContent,
  DropdownMenuItem as RadixDropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger as RadixDropdownMenuTrigger,
  type DropdownMenuContentProps,
} from 'radix-vue'
import { cn } from '@/lib/utils'

export const DropdownMenu = defineComponent({
  name: 'DropdownMenu',
  setup(_, { slots }) {
    return () => <DropdownMenuRoot>{slots.default?.()}</DropdownMenuRoot>
  },
})

export const DropdownMenuTrigger = defineComponent({
  name: 'DropdownMenuTrigger',
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () => (
      <RadixDropdownMenuTrigger asChild={props.asChild}>
        {slots.default?.()}
      </RadixDropdownMenuTrigger>
    )
  },
})

export const DropdownMenuContent = defineComponent({
  name: 'DropdownMenuContent',
  props: {
    align: {
      type: String as PropType<DropdownMenuContentProps['align']>,
      default: 'center',
    },
    class: String,
  },
  setup(props, { slots }) {
    return () => (
      <DropdownMenuPortal>
        <RadixDropdownMenuContent
          align={props.align}
          class={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.class
          )}
        >
          {slots.default?.()}
        </RadixDropdownMenuContent>
      </DropdownMenuPortal>
    )
  },
})

export const DropdownMenuItem = defineComponent({
  name: 'DropdownMenuItem',
  props: {
    class: String,
    onClick: Function as PropType<() => void>,
  },
  setup(props, { slots }) {
    return () => (
      <RadixDropdownMenuItem
        class={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          props.class
        )}
        onClick={props.onClick}
      >
        {slots.default?.()}
      </RadixDropdownMenuItem>
    )
  },
})