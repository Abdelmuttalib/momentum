import { Loader2 } from 'lucide-react'

export function ButtonLoaderIcon({ isPending }: { isPending: boolean }) {
  return <>{isPending && <Loader2 className="h-5 w-5 animate-spin" />}</>
}
