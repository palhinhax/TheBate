"use client";

import { useState } from "react";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "@/lib/use-translations";

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

export function ShareButton({
  title,
  description: _description,
  url,
  hashtags = ["debate", "discussion"],
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslations();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const hashtagString = hashtags.join(",");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer,width=600,height=600");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t("share.share", "Share")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("share.share_discussion", "Share discussion")}</DialogTitle>
          <DialogDescription>
            {t("share.share_description", "Choose where to share this discussion")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          {/* Twitter/X */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            <span>{t("share.share_on_twitter", "Share on Twitter / X")}</span>
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-5 w-5 text-[#1877F2]" />
            <span>{t("share.share_on_facebook", "Share on Facebook")}</span>
          </Button>

          {/* LinkedIn */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("linkedin")}
          >
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            <span>{t("share.share_on_linkedin", "Share on LinkedIn")}</span>
          </Button>

          {/* Reddit */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("reddit")}
          >
            <MessageCircle className="h-5 w-5 text-[#FF4500]" />
            <span>{t("share.share_on_reddit", "Share on Reddit")}</span>
          </Button>

          {/* WhatsApp */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("whatsapp")}
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            <span>{t("share.share_on_whatsapp", "Share on WhatsApp")}</span>
          </Button>

          {/* Copy Link */}
          <Button variant="outline" className="w-full justify-start gap-3" onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-500">{t("share.link_copied", "Link copied!")}</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-5 w-5" />
                <span>{t("share.copy_link", "Copy link")}</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
