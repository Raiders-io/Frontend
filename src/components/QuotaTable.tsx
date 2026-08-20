import {
  Table,
  TableBody,
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
      // setError("Impossible to load the quota.")
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

  return (
    <>
      <Card className={containerClassName}>
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
              <div className="overflow-hidden rounded-lg border">
                <Table
                  className={`w-full caption-bottom ${mode === "compact" ? "text-xs" : "text-sm"}`}
                >
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
                      <TableCell>{formatFileSize(quota?.storageBytesLimit)}</TableCell>
                      <TableCell>{((quota?.storageBytes || 0) / (quota?.storageBytesLimit || 1) * 100 || 0).toFixed(2)}%</TableCell>
                      <TableCell>{quota?.objectCount} files</TableCell>
                      <TableCell>{quota?.objectCountLimit} files</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <h3 className="py-4 text-lg font-semibold">Quota rates:</h3>
              <div className="overflow-hidden rounded-lg border">
                <Table
                  className={`w-full caption-bottom ${mode === "compact" ? "text-xs" : "text-sm"}`}
                >
                  <TableHeader>
                    <TableRow>
                      <TableHead>Total Upload count</TableHead>
                      <TableHead>Upload count limit</TableHead>
                      <TableHead>Storage Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{quota?.uploadCount}</TableCell>
                      <TableCell>{quota?.uploadCountLimit}</TableCell>
                      <TableCell>
                        {formatFileSize(quota?.storageBytes)}/{formatFileSize(quota?.storageBytesLimit)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
