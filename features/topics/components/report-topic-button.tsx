"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";

interface ReportTopicButtonProps {
  slug: string;
  className?: string;
}

export function ReportTopicButton({ slug, className }: ReportTopicButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const handleReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/topics/${slug}/report`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: t("reports.report_success"),
        });
        setShowDialog(false);
      } else {
        toast({
          title: t("reports.report_error"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Report error:", error);
      toast({
        title: t("reports.report_error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className={className}
      >
        <Flag className="mr-2 h-4 w-4" />
        {t("reports.report_topic")}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              {t("reports.report_topic")}
            </DialogTitle>
            <DialogDescription className="pt-4">
              Tem a certeza que deseja reportar este tema? O nosso painel de
              moderação vai analisar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={loading}
            >
              {t("reports.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Flag className="mr-2 h-4 w-4" />
                  {t("reports.submit_report")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
