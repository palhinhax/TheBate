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
    window.open(
      shareLinks[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=600"
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Partilhar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partilhar discussão</DialogTitle>
          <DialogDescription>
            Escolhe onde queres partilhar esta discussão
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
            <span>Partilhar no Twitter / X</span>
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-5 w-5 text-[#1877F2]" />
            <span>Partilhar no Facebook</span>
          </Button>

          {/* LinkedIn */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("linkedin")}
          >
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            <span>Partilhar no LinkedIn</span>
          </Button>

          {/* Reddit */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("reddit")}
          >
            <MessageCircle className="h-5 w-5 text-[#FF4500]" />
            <span>Partilhar no Reddit</span>
          </Button>

          {/* WhatsApp */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShare("whatsapp")}
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            <span>Partilhar no WhatsApp</span>
          </Button>

          {/* Copy Link */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-500">Link copiado!</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-5 w-5" />
                <span>Copiar link</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
