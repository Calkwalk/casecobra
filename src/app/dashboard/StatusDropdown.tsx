'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { changeOrderStatus } from './actions'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  fulfilled: 'Completed',
  shipped: 'Shipped',
  awaiting_shipment: 'Awaiting Shipment'
}

const StatusDropdown = ({
  id,
  orderStatus
}: {
  id: string,
  orderStatus: OrderStatus
}) => {
  // const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(orderStatus)
  const [isPending, setIsPending] = useState(false)

  const { mutate: changeStatus } = useMutation({
    mutationKey: ['change-order-status'],
    mutationFn: changeOrderStatus,
    onMutate: () => setIsPending(true),
    onSuccess: (status) => {
      setCurrentStatus(status)
      // router.refresh();
      setIsPending(false)
    },
    onError: () => {
      setIsPending(false)
      toast({
        title: 'Somthing went wrong',
        description: 'There was an error on our end. Please try again.',
        variant: 'destructive',
      })
    }
  })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-52 flex justify-center items-center'>
          {isPending && <Loader2 className='h-4 w-4 shrink-0 mr-2 animate-spin' />}
          {LABEL_MAP[currentStatus]}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem disabled={isPending}
            key={status}
            className={cn("flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              { 'bg-zinc-100': currentStatus === status }
            )}
            onClick={() => changeStatus({ id, newStatus: status as OrderStatus })}>
            <div className='h-4 w-4 shrink-0 mr-2'>
              {currentStatus === status && (
                <Check className='h-4 w-4 text-primary' />
              )}
            </div>

            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StatusDropdown