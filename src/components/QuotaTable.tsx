import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  // TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { objectService } from "@/services/object_service"
import type { QuotaResponse } from "@/utils/types/object"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatFileSize } from "@/utils/utils/object"

export function QuotaTable({ mode = "full" }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [quota, setQuota] = useState<QuotaResponse | null>(null)

  useEffect(() => {
    void refreshQuota()
  }, [])

  const refreshQuota = async () => {
    setLoading(true)
    setError(false)

    try {
      const response = await objectService.quotaRetrieve()
      setQuota(response)
    } catch (requestError) {
      console.error("Quota error:", requestError)
      setError(true)
      setQuota(null)
      setTimeout(() => {
        refreshQuota()
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  const containerClassName =
    mode === "compact" ? "w-full p-4" : "mx-auto w-full max-w-6xl p-6"

  const quotaStorageLimits = () => {
    const storageUsed = quota?.storageBytes || 0
    const storageLimit = quota?.storageBytesLimit || 1
    const storageRatio = () => {
      let temp = ((storageUsed / storageLimit) * 100).toFixed(2)
      return storageUsed != 0 && temp === "0.00" ? "<0.01" : temp
    }

    return (
      <>
        <div className="overflow-hidden rounded-lg border">
          <Table
            className={`w-full caption-top ${mode === "compact" ? "text-xs" : "text-sm"}`}
          >
            <TableCaption className="text-lg underline font-semibold">
              Quota storage limits
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Storage Used</TableHead>
                <TableHead>Storage Limit</TableHead>
                <TableHead>Storage Ratio</TableHead>
                <TableHead>Total Files count</TableHead>
                <TableHead>Files count limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{formatFileSize(quota?.storageBytes)}</TableCell>
                <TableCell>
                  {formatFileSize(quota?.storageBytesLimit)}
                </TableCell>
                <TableCell>{storageRatio()}%</TableCell>
                <TableCell>{quota?.objectCount} files</TableCell>
                <TableCell>{quota?.objectCountLimit} files</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </>
    )
  }

  const quotaRateLimit = () => {
    return (
      <>
        <div className="overflow-hidden rounded-lg border">
          <Table
            className={`w-full caption-top ${mode === "compact" ? "text-xs" : "text-sm"}`}
          >
            <TableCaption className="text-lg underline font-semibold">
              Quota rate limiting
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Download Count Reset At</TableHead>
                <TableHead>Upload Count Reset At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{quota?.downloadCountResetAt}</TableCell>
                <TableCell>{quota?.uploadCountResetAt}</TableCell>
                <TableCell>{quota?.updatedAt}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </>
    )
  }

  const quotaStorageCounter = () => {
    return (
      <>
        <div className="overflow-hidden rounded-lg border">
          <Table
            className={`w-full caption-top ${mode === "compact" ? "text-xs" : "text-sm"}`}
          >
            <TableCaption className="text-lg underline font-semibold">
              Quota storage counter
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Total Upload count</TableHead>
                <TableHead>Upload count limit</TableHead>
                <TableHead>Total Download count</TableHead>
                <TableHead>Download count limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{quota?.uploadCount}</TableCell>
                <TableCell>{quota?.uploadCountLimit}</TableCell>
                <TableCell>{quota?.downloadCount}</TableCell>
                <TableCell>{quota?.downloadCountLimit}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </>
    )
  }

  return (
    <div className={`${containerClassName} gap-3`}>
      <Card>
        <CardHeader>
          <CardTitle>Quota</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-sm text-muted-foreground">
              Loading Quota...
            </p>
          ) : error ? (
            <p className="py-8 text-sm text-destructive">
              Impossible to load the quota.
            </p>
          ) : (
            <div>
              {mode === "compact" ? (
                quotaStorageLimits()
              ) : (
                <>
                  {quotaStorageLimits()}
                  {quotaStorageCounter()}
                  {quotaRateLimit()}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
