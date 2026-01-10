"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { topicSchema, type TopicFormData, type TopicOptionData } from "@/features/topics/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";
import { X, Globe, Plus, GripVertical } from "lucide-react";
import { LANGUAGES, type SupportedLanguage } from "@/lib/language-shared";

export default function NewTopicForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("pt");
  const [selectedType, setSelectedType] = useState<"YES_NO" | "MULTI_CHOICE">("YES_NO");
  const [options, setOptions] = useState<TopicOptionData[]>([]);
  const [optionInput, setOptionInput] = useState("");
  const [optionDescInput, setOptionDescInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      language: "pt",
      type: "YES_NO",
      allowMultipleVotes: false,
      maxChoices: 1,
      tags: [],
    },
  });

  const watchType = useWatch({ control, name: "type" });
  const watchAllowMultipleVotes = useWatch({ control, name: "allowMultipleVotes" });

  // Detect user's preferred language on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedLanguage(parsed[0]);
          setValue('language', parsed[0]);
        }
      } catch {
        // ignore
      }
    }
  }, [setValue]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddOption = () => {
    const label = optionInput.trim();
    if (!label) {
      toast({
        title: "Erro",
        description: "O rótulo da opção não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    if (options.length >= 10) {
      toast({
        title: "Limite atingido",
        description: "Máximo de 10 opções permitidas",
        variant: "destructive",
      });
      return;
    }

    const newOption: TopicOptionData = {
      label,
      description: optionDescInput.trim() || undefined,
      order: options.length,
    };

    const newOptions = [...options, newOption];
    setOptions(newOptions);
    setValue("options", newOptions);
    setOptionInput("");
    setOptionDescInput("");
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index).map((opt, i) => ({
      ...opt,
      order: i,
    }));
    setOptions(newOptions);
    setValue("options", newOptions);
  };

  const onSubmit = async (data: TopicFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t("topics.create_error", "Erro ao criar tema"));
      }

      const topic = await response.json();
      toast({
        title: t("topics.created_success", "Tema criado!"),
        description: t("topics.created_description", "O seu tema foi criado com sucesso."),
      });
      router.push(`/t/${topic.slug}`);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: t("common.error", "Erro"),
          description: error.message,
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">{t("topics.title", "Título")}</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder={t("topics.title_placeholder", "Ex: IA vai substituir programadores?")}
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">{t("topics.description", "Descrição")}</Label>
        <textarea
          id="description"
          {...register("description")}
          placeholder={t("topics.description_placeholder", "Descreva o tema em detalhes...")}
          className="mt-1 min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Topic Type */}
      <div>
        <Label htmlFor="type">{t("topics.type", "Tipo de Tema")}</Label>
        <select
          id="type"
          value={selectedType}
          onChange={(e) => {
            const type = e.target.value as "YES_NO" | "MULTI_CHOICE";
            setSelectedType(type);
            setValue("type", type);
            if (type === "YES_NO") {
              setOptions([]);
              setValue("options", undefined);
            }
          }}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="YES_NO">{t("topics.type_yes_no", "Sim/Não")}</option>
          <option value="MULTI_CHOICE">{t("topics.type_multi_choice", "Múltipla Escolha")}</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          {selectedType === "YES_NO" 
            ? "Tema tradicional de votação Sim/Não/Depende" 
            : "Tema com múltiplas opções para votação"}
        </p>
      </div>

      {/* Multi-choice Options */}
      {selectedType === "MULTI_CHOICE" && (
        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <Label>Opções de Votação</Label>
            <p className="text-xs text-muted-foreground">
              Adicione pelo menos 2 opções para o seu tema de múltipla escolha
            </p>
          </div>

          {/* Add Option Form */}
          <div className="space-y-3">
            <div>
              <Input
                placeholder="Nome da opção (ex: Messi, Ronaldo, Pelé)"
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
            </div>
            <div>
              <Input
                placeholder="Descrição (opcional)"
                value={optionDescInput}
                onChange={(e) => setOptionDescInput(e.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddOption}
              disabled={!optionInput.trim()}
              variant="outline"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Opção
            </Button>
          </div>

          {/* Options List */}
          {options.length > 0 && (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-md border bg-muted/50 p-3"
                >
                  <GripVertical className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {errors.options && (
            <p className="text-sm text-destructive">{errors.options.message}</p>
          )}

          {/* Allow Multiple Votes */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowMultipleVotes"
              {...register("allowMultipleVotes")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="allowMultipleVotes" className="cursor-pointer">
              Permitir seleção de múltiplas opções
            </Label>
          </div>

          {/* Max Choices */}
          {watchAllowMultipleVotes && (
            <div>
              <Label htmlFor="maxChoices">Número máximo de opções</Label>
              <Input
                type="number"
                id="maxChoices"
                {...register("maxChoices", { valueAsNumber: true })}
                min="1"
                max={options.length || 10}
                className="mt-1"
              />
              {errors.maxChoices && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.maxChoices.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div>
        <Label htmlFor="tags">{t("topics.tags", "Tags")}</Label>
        <div className="mt-1 flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagKeyPress}
            placeholder={t("topics.tags_placeholder", "Ex: tecnologia, ia, programação")}
            disabled={tags.length >= 5}
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={tags.length >= 5 || !tagInput.trim()}
          >
            {t("topics.add_tag", "Adicionar")}
          </Button>
        </div>
        {errors.tags && (
          <p className="mt-1 text-sm text-destructive">{errors.tags.message}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {t("topics.tags_help", "Adicione de 1 a 5 tags para categorizar o seu tema")}
        </p>
      </div>

      {/* Language */}
      <div>
        <Label htmlFor="language">
          <Globe className="inline h-4 w-4 mr-1" />
          {t("topics.language_label", "Idioma do Tema")}
        </Label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => {
            const lang = e.target.value as SupportedLanguage;
            setSelectedLanguage(lang);
            setValue('language', lang);
          }}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("topics.language_help", "Escolha o idioma em que vai escrever este tema")}
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("topics.creating", "A criar...") : t("topics.create_button", "Criar Tema")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          {t("topics.cancel", "Cancelar")}
        </Button>
      </div>
    </form>
  );
}
