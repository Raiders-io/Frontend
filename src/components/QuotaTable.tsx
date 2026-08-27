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
import { useTranslation } from 'react-i18next'

export function QuotaTable({ mode = "full" }) {
  const { t } = useTranslation();
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
    mode === "compact" ? "w-full p-4" : t('style-padding-files', 'mx-auto w-full max-w-6xl p-6')

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
              {t('quota_storage_limits')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('storage_used')}</TableHead>
                <TableHead>{t('storage_limit')}</TableHead>
                <TableHead>{t('storage_ratio')}</TableHead>
                <TableHead>{t('total_files_count')}</TableHead>
                <TableHead>{t('files_count_limit')}</TableHead>
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
              {t('quota_rate_limiting')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('download_count_reset_at')}</TableHead>
                <TableHead>{t('upload_count_reset_at')}</TableHead>
                <TableHead>{t('updated_at')}</TableHead>
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
              {t('quota_storage_counter')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('total_upload_count')}</TableHead>
                <TableHead>{t('upload_count_limit')}</TableHead>
                <TableHead>{t('total_download_count')}</TableHead>
                <TableHead>{t('download_count_limit')}</TableHead>
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
          <CardTitle>{t('quota')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-sm text-muted-foreground">
              {t('loading_quota')}
            </p>
          ) : error ? (
            <p className="py-8 text-sm text-destructive">
              {t('impossible_to_load_quota')}
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
